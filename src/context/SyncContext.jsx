import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../data/db.ts";
import { addFullSong } from "../data/db_utils.ts";

const SyncContext = createContext();

export const SyncProvider = ({ children }) => {
  const [syncing, setSyncing] = useState(true);

  const handleSync = async () => {
    // get the array of file paths
    let fps = (await db.songs.toArray()).map((s) => s.file_path);
    const tracks = await window.vibesApp.loadMusicLibrary();

    for (const track of tracks) {
      // compare with the songs in the pc
      if (fps.includes(track.path)) continue;

      try {
        let res = await fetch(`http://127.0.0.1:3000/api/track?title=${track.query}`);

        const trackData = await res.json();

        trackData.file_path = track.path;
        trackData.is_spotify = true;

        await addFullSong(trackData);
      } catch (err) {}
    }

    setSyncing(false);
  };

  const value = {
    syncing,
    setSyncing,
  };

  useEffect(() => {
    handleSync();
  }, []);

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
};

export const useSync = () => useContext(SyncContext);
