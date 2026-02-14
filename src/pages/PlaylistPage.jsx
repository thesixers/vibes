import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks"; // Keep useLiveQuery
import {
  ArrowLeft,
  Play,
  Pause,
  MoreHorizontal,
  Music,
  Trash2,
  ListMusic,
  UploadCloud,
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { db } from "../data/db";
import { formatDuration, localUrl } from "../data/utils";
import Loading from "../components/Loading";
import AddtoPlayList from "../components/AddtoPlayList";
import { useSync } from "../context/SyncContext";

const CollectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playPlaylist, currentTrack, isPlaying, togglePlay } = usePlayer();

  // State for Dropdowns & Modals
  const [activeMenu, setActiveMenu] = useState(null);
  const [songToAction, setSongToAction] = useState(null);

  const collectionData = useLiveQuery(async () => {
    if (!id) return null;

    if (id === "all") {
      const rawSongs = await db.songs.toArray();
      const songs = await Promise.all(
        rawSongs.map(async (song) => {
          const artists = await db.artists
            .where("id")
            .anyOf(song.artist_ids)
            .toArray();
          const album = await db.albums.get(song.album_id);
          return { ...song, artists, album };
        })
      );

      return {
        type: "library",
        id: "all",
        title: "All Songs",
        description: `${songs.length} tracks in your library`,
        cover: null,
        creator: "You",
        songs: songs,
        totalDuration: songs.reduce((acc, s) => acc + s.duration, 0),
      };
    }

    // Album
    const album = await db.albums.get(id);
    if (album) {
      const rawSongs = await db.songs.where("album_id").equals(id).toArray();
      const songs = await Promise.all(
        rawSongs.map(async (song) => {
          const artists = await db.artists
            .where("id")
            .anyOf(song.artist_ids)
            .toArray();
          return { ...song, artists, album };
        })
      );

      return {
        type: "album",
        id,
        title: album.title,
        description: `Released ${new Date(
          album.release_date
        ).getFullYear()} • ${songs.length} Songs`,
        cover: album.images?.[0]?.url,
        creator: songs[0]?.artists?.[0]?.name || "Unknown Artist",
        songs: songs,
        totalDuration: songs.reduce((acc, s) => acc + s.duration, 0),
      };
    }

    // Playlist
    const playlistID = Number(id);
    const playlist = await db.playlists.get(playlistID);
    if (playlist) {
      const songIds = playlist.song_ids || [];
      const rawSongs = await db.songs.where("id").anyOf(songIds).toArray();
      const songs = await Promise.all(
        rawSongs.map(async (song) => {
          const artists = await db.artists
            .where("id")
            .anyOf(song.artist_ids)
            .toArray();
          const alb = await db.albums.get(song.album_id);
          return { ...song, artists, album: alb };
        })
      );
      return {
        type: "playlist",
        id: playlistID,
        title: playlist.title,
        description: playlist.description,
        cover: playlist.cover_image?.url,
        creator: "User",
        songs: songs,
        totalDuration: songs.reduce((acc, s) => acc + s.duration, 0),
      };
    }
    return null;
  }, [id]);

  const handleDelete = async (songId) => {
    if (!collectionData) return;
    if (collectionData.type === "playlist") {
      const playlist = await db.playlists.get(collectionData.id);
      if (playlist) {
        const newSongs = playlist.song_ids.filter((sId) => sId !== songId);
        await db.playlists.update(collectionData.id, { song_ids: newSongs });
      }
    } else {
      if (window.confirm("Delete this song permanently from your library?")) {
        await db.songs.delete(songId);
      }
    }
    setActiveMenu(null);
  };

  const handleAddToPlaylist = async (playlistId) => {
    if (!songToAction) return;
    try {
      const playlist = await db.playlists.get(playlistId);
      if (playlist) {
        playlist.song_ids = playlist.song_ids || [];
        const inPlaylist = playlist?.song_ids.includes(songToAction);

        if (!inPlaylist) {
          await db.playlists.update(playlist.id, {
            song_ids: [...playlist.song_ids, songToAction],
          });
        }
      }
      setShowPlaylistModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSongToAction(null);
    }
  };

  const handlePlayCollection = (index = 0) => {
    if (currentTrack && currentTrack.id === collectionData.songs[index].id)
      return togglePlay();
    if (collectionData?.songs?.length > 0) {
      playPlaylist(collectionData.songs, index);
    }
  };

  const handleTrackBackUp = async (track) => {
    if (!track || track.is_backed_up) return;

    const { buffer, contentType, fileName } =
      await window.vibesApp.getTrackBuffer(track.file_path);

    const blob = new Blob([buffer], { type: contentType });

    const formData = new FormData();

    formData.append("file", blob, fileName);
    formData.append(
      "metadata",
      JSON.stringify({ ...track, file_path: null, fileName })
    );

    try {
      const response = await fetch(`${localUrl}/api/tracks/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Track backed up successfully! Backup ID: ${data.backupId}`);
        await db.songs.update(track.id, { is_backed_up: true });
      } else {
        alert("Failed to back up track.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [activeMenu]);

  // Add this inside your CollectionPage component, before the return
  if (!collectionData) return <Loading />;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-purple-900/20 to-black pb-32">
      <style>{`
        @keyframes equalizer {
          0% { height: 10%; }
          50% { height: 100%; }
          100% { height: 10%; }
        }
        .animate-equalizer {
          animation: equalizer 1s ease-in-out infinite;
        }
      `}</style>

      <AddtoPlayList
        songToAction={songToAction}
        setSongToAction={setSongToAction}
      />

      <div className="p-6 md:p-8 space-y-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
        >
          <div className="p-2 rounded-full group-hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </div>
          <span className="font-medium">Back</span>
        </button>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 text-center md:text-left">
          <div className="w-48 h-48 md:w-60 md:h-60 flex-shrink-0 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {collectionData.cover ? (
              <img
                src={collectionData.cover}
                alt={collectionData.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900 to-purple-600 flex items-center justify-center">
                <Music size={54} className="text-white/50" />
              </div>
            )}
          </div>

          <div className="flex-1 pb-2">
            <p className="text-xs md:text-sm font-bold tracking-wider text-white/60 mb-2 uppercase">
              {collectionData.type}
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold font-vibes mb-4 text-white tight-leading">
              {collectionData.title}
            </h1>
            <p className="text-white/70 text-sm md:text-base line-clamp-2 max-w-2xl">
              {collectionData.description}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-white/80 mt-4 font-medium">
              <span>{collectionData.songs.length} tracks</span>
              <span className="text-white/40">•</span>
              <span className="text-white/60">
                {Math.floor(collectionData.totalDuration / 60000)} min
              </span>
            </div>
          </div>
        </div>

        {/* ACTION BAR (Updated for Responsiveness) */}
        {/* Added 'justify-center md:justify-start' to center button on mobile */}
        <div className="flex items-center justify-center md:justify-start gap-6 py-4">
          <button
            onClick={() => handlePlayCollection(0)}
            className="w-14 h-14 rounded-full bg-purple-electric hover:bg-purple-500 flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-purple-500/30 group"
          >
            {isPlaying && currentTrack?.id === collectionData.songs[0]?.id ? (
              <Pause size={28} className="text-black fill-current" />
            ) : (
              <Play size={28} className="text-black ml-1 fill-current" />
            )}
          </button>
        </div>

        {/* TRACK LIST TABLE */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-visible border border-white/5 min-h-[200px]">
          <div className="grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 md:px-6 py-3 border-b border-white/10 text-xs font-medium text-white/40 tracking-wider">
            <div className="w-10 text-center">#</div>
            <div>TITLE</div>
            <div className="hidden md:block">ALBUM</div>
            <div className="text-right">TIME</div>
            <div className="w-10"></div>
          </div>

          <div className="flex flex-col">
            {collectionData.songs.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;
              const trackImage =
                track.images?.[1]?.url ||
                track.images?.[0]?.url ||
                "/default-track.png";

              return (
                <div
                  key={track.id}
                  className={`group grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-4 md:px-6 py-3 hover:bg-white/10 transition-colors items-center relative ${
                    isCurrent ? "bg-white/10" : ""
                  }`}
                >
                  {/* # Column - With Equalizer */}
                  <div
                    onClick={() => handlePlayCollection(index)}
                    className="w-10 flex justify-center text-white/50 font-medium cursor-pointer"
                  >
                    {isCurrent && isPlaying ? (
                      <div className="flex items-end justify-center gap-[2px] h-3 w-4">
                        <div
                          className="w-[3px] bg-purple-electric animate-equalizer"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-[3px] bg-purple-electric animate-equalizer"
                          style={{ animationDelay: "200ms" }}
                        ></div>
                        <div
                          className="w-[3px] bg-purple-electric animate-equalizer"
                          style={{ animationDelay: "400ms" }}
                        ></div>
                        <div
                          className="w-[3px] bg-purple-electric animate-equalizer"
                          style={{ animationDelay: "100ms" }}
                        ></div>
                      </div>
                    ) : isCurrent ? (
                      <span className="text-purple-electric font-bold">
                        {index + 1}
                      </span>
                    ) : (
                      <>
                        <span className={`group-hover:hidden`}>
                          {index + 1}
                        </span>
                        <Play
                          size={14}
                          className="hidden group-hover:block text-white"
                          fill="white"
                        />
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <div
                    onClick={() => handlePlayCollection(index)}
                    className="flex items-center gap-3 md:gap-4 overflow-hidden cursor-pointer"
                  >
                    <div className="w-10 h-10 flex-shrink-0 rounded bg-white/5 overflow-hidden">
                      <img
                        src={trackImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span
                        className={`truncate font-medium text-sm md:text-base ${
                          isCurrent ? "text-purple-electric" : "text-white"
                        }`}
                      >
                        {track.title}
                      </span>
                      <span className="truncate text-xs md:text-sm text-white/60 group-hover:text-white transition-colors">
                        {track.artists?.map((a) => a.name).join(", ")}
                      </span>
                    </div>
                  </div>

                  {/* Album */}
                  <div
                    onClick={() => handlePlayCollection(index)}
                    className="hidden md:flex text-sm text-white/40 items-center truncate group-hover:text-white/60 cursor-pointer"
                  >
                    {track.album?.title || collectionData.title}
                  </div>

                  {/* Duration */}
                  <div className="text-xs md:text-sm text-white/40 font-mono flex justify-end items-center">
                    {formatDuration(track.duration)}
                  </div>

                  {/* Dropdown Menu */}
                  <div className="flex justify-end relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(
                          activeMenu === track.id ? null : track.id
                        );
                      }}
                      className="p-1.5 rounded-full hover:bg-white/20 text-white/40 hover:text-white transition-colors"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {activeMenu === track.id && (
                      <div
                        className="absolute right-0 top-full mt-1 w-48 bg-[#181818] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setSongToAction(track.id);
                            setActiveMenu(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors text-left"
                        >
                          <ListMusic size={16} /> Add to Playlist
                        </button>
                        <button
                          onClick={() => {
                            handleTrackBackUp(track);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors text-left"
                        >
                          <UploadCloud size={16} /> Backup
                        </button>
                        <div className="h-[1px] bg-white/5 my-1" />
                        <button
                          onClick={() => handleDelete(track.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <Trash2 size={16} />{" "}
                          {collectionData.type === "playlist"
                            ? "Remove from Playlist"
                            : "Delete from Library"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
