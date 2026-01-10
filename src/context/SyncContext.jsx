import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../data/db.ts";
import { addFullSong } from "../data/db_utils.ts";
import stringSimilarity from "string-similarity";
import useOnlineStatus from "../hooks/useOnlineStatus.jsx";

const SyncContext = createContext();

export const SyncProvider = ({ children }) => {
  const [syncing, setSyncing] = useState(false);
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const isOnline = useOnlineStatus();

  // function to sync local music library with spotify database from my server
  const handleSync = async () => {
    if (!isOnline) return;
    setSyncing(true);
  
    // Use a Set for O(1) lookups
    const existingPaths = new Set(
      (await db.songs.toArray()).map(s => s.file_path)
    );
  
    const tracks = await window.vibesApp.loadMusicLibrary();
  
    for (const track of tracks) {
      // skip already indexed songs
      if (existingPaths.has(track.path)) continue;
  
      const queries = [
        `${track.title || ""} ${track.artist || ""}`,
        track.filename || "",
        track.title || "",
        `${track.artist || ""} ${track.title || ""}`,
      ];
      
  for (let index = 0; index < queries.length; index++) {
        const query = queries[index].trim();
        if(!query) continue;
        try {
          const res = await fetch(
            `https://vibes-spotify.onrender.com/api/track?title=${encodeURIComponent(query)}`
          );
  
          if (!res.ok) continue;
  
          const trackData = await res.json();
  
          if (!newVerifyMatch(track, trackData)) continue;
  
          // if match was found
          await addFullSong({
            ...trackData,
            file_path: track.path,
            is_spotify: true
          });
  
          
          break; // stop querying once matched
        } catch (err) {
          // console.warn("Spotify lookup failed:", query, err);
        }
      }
    }
  
    setSyncing(false);
  };


  // this is the new verify match function edit it as you like to improve matching
  const newVerifyMatch = (localTrack, serverResult) => {
    if(!serverResult) return false;
  
    const clean = (str) => str?.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    
    const localTitle = clean(localTrack.title);
    const serverTitle = clean(serverResult.name);
  
    const localArtist = clean(localTrack.artist.replaceAll(",", " "));
    const serverArtist = clean(serverResult.artists.map(art => art.name).join(" ").replaceAll(",", " "));
  
    let totalScore = 0;
  
    // check if localTitle is included in serverTitle
    if(serverTitle.includes(localTitle) || localTitle.includes(serverTitle)){
      totalScore += 0.6;
    } else {
      const titleScore = stringSimilarity.compareTwoStrings(localTitle, serverTitle);
      totalScore += titleScore * 0.6;
    } 
  
    // check if localArtist is included in serverArtist
    if(serverArtist.includes(localArtist) || localArtist.includes(serverArtist)){
      totalScore += 0.4;
    } else {
      const artistScore = stringSimilarity.compareTwoStrings(localArtist, serverArtist);
      totalScore += artistScore * 0.4;
    }
  
    // check if serverArtist includes all localTrack artists
    const localArtistsArray = localTrack.artist.split(" ");
    let allArtistsIncluded = true;
    for(const art of localArtistsArray){
      if(!serverArtist.includes(art)){
        allArtistsIncluded = false;
        break;
      }
    }
    if(allArtistsIncluded){
      totalScore += 0.1;
    }

    // check if serverTitle includes localArtist
    if(serverTitle.includes(localArtist) || localArtist.includes(serverTitle)){
      totalScore += 0.1;
    }

    // check if serverArtist includes localTitle
    if(serverArtist.includes(localTitle) || localTitle.includes(serverArtist)){
      totalScore += 0.1;
    }

    console.log({
      localTitle,
      serverTitle,
      localArtist,
      serverArtist,
      totalScore
    });
    console.log("---------------------------------------");
    
    return totalScore >= 0.75;
  }

  const value = {
    syncing,
    setSyncing,
    showPlaylistForm,
    setShowPlaylistForm,
    isOnline,
    handleSync,
  };

  useEffect(() => {
    handleSync();
  }, []);

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
};

export const useSync = () => useContext(SyncContext);
