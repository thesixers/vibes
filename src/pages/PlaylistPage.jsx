import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowLeft,
  Play,
  RotateCw,
  MoreHorizontal,
  Music,
  Trash2,
  ListMusic,
  CheckCircle2Icon,
  Search,
  X,
  UploadCloud,
  Layers,
  XIcon,
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { db } from "../data/db";
import { formatDuration } from "../data/utils";
import Loading from "../components/Loading";
import AddtoPlayList from "../components/AddtoPlayList";
import { useSync } from "../context/SyncContext";

const CollectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playPlaylist, currentTrack, isPlaying } = usePlayer();

  const {
    insertTrackToBackUp,
    backUpIdList,
    getTrackBackUpStatus,
    removeTrackFromBackUp,
  } = useSync();

  const [backupStatuses, setBackupStatuses] = useState({});
  const backupIntervals = useRef(new Map());

  const [activeMenu, setActiveMenu] = useState(null);
  const [songToAction, setSongToAction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Start tracking backup progress
  const startBackupTracking = (trackId) => {
    if (backupIntervals.current.has(trackId)) return;

    setBackupStatuses((prev) => ({
      ...prev,
      [trackId]: "pending",
    }));

    const interval = setInterval(() => {
      const status = getTrackBackUpStatus(trackId);

      setBackupStatuses((prev) => ({
        ...prev,
        [trackId]: status,
      }));

      if (status === "complete" || status === "failed") {
        clearInterval(interval);
        backupIntervals.current.delete(trackId);

        if (status === "complete") {
          removeTrackFromBackUp(trackId);
        }
      }
    }, 2000);

    backupIntervals.current.set(trackId, interval);
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      backupIntervals.current.forEach((interval) => clearInterval(interval));
      backupIntervals.current.clear();
    };
  }, []);

  // Auto-start tracking for tracks in backup list
  useEffect(() => {
    backUpIdList.forEach((trackId) => {
      startBackupTracking(trackId);
    });
  }, [backUpIdList]);

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
        type: "Library",
        id: "all",
        title: "All Songs",
        description: "Your indexed master collection.",
        cover: null,
        creator: "Joe",
        songs,
        totalDuration: songs.reduce((acc, s) => acc + s.duration, 0),
      };
    }

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
        type: "Album",
        id,
        title: album.title,
        description: `Released ${new Date(album.release_date).getFullYear()}`,
        cover: album.images?.[0]?.url,
        creator: songs[0]?.artists?.[0]?.name,
        songs,
        totalDuration: songs.reduce((acc, s) => acc + s.duration, 0),
      };
    }

    const playlist = await db.playlists.get(Number(id));
    if (playlist) {
      const rawSongs = await db.songs
        .where("id")
        .anyOf(playlist.song_ids || [])
        .toArray();

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
        type: "Playlist",
        id: Number(id),
        title: playlist.title,
        description: playlist.description,
        cover: playlist.cover_image?.url,
        creator: "Joe",
        songs,
        totalDuration: songs.reduce((acc, s) => acc + s.duration, 0),
      };
    }

    return null;
  }, [id]);

  // Backup function
  const handleTrackBackUp = async (track) => {
    const status = getTrackBackUpStatus(track.id);

    const isBackAble =
      !track.is_backed_up &&
      !backUpIdList.includes(track.id) &&
      (status !== "pending" || status === "failed");

    if (!isBackAble) return;

    insertTrackToBackUp(track);
    startBackupTracking(track.id);
  };

  // Delete/Remove function
  const handleDelete = async (songId) => {
    if (!collectionData) return;

    if (collectionData.type === "Playlist") {
      const playlist = await db.playlists.get(collectionData.id);
      if (playlist) {
        const newSongs = playlist.song_ids.filter((sId) => sId !== songId);
        await db.playlists.update(collectionData.id, { song_ids: newSongs });
      }
    } else if (window.confirm("Confirm permanent deletion from library?")) {
      await db.songs.delete(songId);
    }

    setActiveMenu(null);
  };

  const filteredSongs =
    collectionData?.songs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artists.some((a) =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

  if (!collectionData) return <Loading />;

  return (
    <>
      {songToAction && (
        <AddtoPlayList
          songToAction={songToAction}
          setSongToAction={setSongToAction}
        />
      )}

      <div className="flex-1 flex flex-col min-h-0 bg-bgMain pb-32">
        {/* HEADER */}
        <div className="relative p-6 md:p-12 shrink-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-center md:items-end relative z-10">
            <button
              onClick={() => navigate(-1)}
              className="absolute -top-4 md:top-0 left-0 p-3 rounded-2xl bg-surface border border-slate-100 dark:border-white/5 text-text-muted hover:text-primary shadow-sm transition-all"
            >
              <ArrowLeft size={20} strokeWidth={3} />
            </button>

            <div className="w-52 h-52 md:w-60 md:h-60 rounded-[2.5rem] overflow-hidden bg-surface shadow-soft border-4 border-white dark:border-white/5 shrink-0">
              {collectionData.cover ? (
                <img
                  src={collectionData.cover}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
                  <Music size={54} className="text-white/40" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Layers size={14} className="text-primary" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                  {collectionData.type}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-text-main tracking-tighter uppercase leading-[0.9]">
                {collectionData.title}
              </h1>

              <p className="text-sm font-bold text-text-muted max-w-xl">
                {collectionData.description}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
                <button
                  onClick={() => playPlaylist(filteredSongs, 0)}
                  className="h-16 px-10 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-soft hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  <Play size={20} fill="currentColor" /> Play Collection
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="px-6 md:px-12 py-4 sticky top-0 z-20 bg-bgMain/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            <div className="relative w-full max-w-md group">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a track..."
                className="w-full pl-12 pr-10 py-4 bg-surface border border-slate-100 dark:border-white/10 rounded-2xl text-sm font-bold text-text-main shadow-sm focus:outline-none focus:border-primary/40 transition-all"
              />

              {searchQuery && (
                <X
                  size={16}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-text-muted hover:text-primary"
                />
              )}
            </div>
          </div>
        </div>

        {/* TRACK LIST */}
        <div className="flex-1 px-4 md:px-12 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-[50px_1fr_100px_50px] md:grid-cols-[60px_2fr_1fr_100px_50px] gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted border-b border-slate-100 dark:border-white/5 mb-4">
            <div className="text-center">Status</div>
            <div>Song Information</div>
            <div className="hidden md:block">Album</div>
            <div className="text-right">Length</div>
            <div />
          </div>

          <div className="space-y-2">
            {filteredSongs.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;

              const backupStatus =
                backupStatuses[track.id] ||
                (track.is_backed_up ? "complete" : null);

              return (
                <div
                  key={track.id}
                  className={`group grid grid-cols-[50px_1fr_100px_50px] md:grid-cols-[60px_2fr_1fr_100px_50px] gap-4 px-6 py-4 items-center rounded-2xl transition-all cursor-pointer border ${
                    isCurrent
                      ? "bg-primary/5 border-primary/20 shadow-sm"
                      : "bg-surface border-transparent hover:border-slate-100 dark:hover:border-white/5 shadow-sm"
                  }`}
                  onClick={() => playPlaylist(filteredSongs, index)}
                >
                  <div className="flex justify-center text-sm font-bold text-text-muted">
                    {isCurrent && isPlaying ? (
                      <div className="flex gap-1 items-end h-4">
                        <div className="w-1 bg-primary animate-bounce h-full" />
                        <div className="w-1 bg-primary animate-bounce h-2/3 [animation-delay:0.2s]" />
                        <div className="w-1 bg-primary animate-bounce h-full [animation-delay:0.4s]" />
                      </div>
                    ) : (
                      <span className={isCurrent ? "text-primary" : ""}>
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-sm border border-white/50">
                      <img
                        src={
                          track.images?.[2]?.url ||
                          track.album?.images?.[2]?.url
                        }
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-base font-bold truncate ${
                          isCurrent ? "text-primary" : "text-text-main"
                        }`}
                      >
                        {track.title}
                      </span>

                      <span className="text-xs font-bold text-text-muted truncate uppercase tracking-tight">
                        {track.artists?.map((a) => a.name).join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="hidden md:block text-xs font-bold text-text-muted truncate uppercase tracking-tighter">
                    {track.album?.title || "Standalone"}
                  </div>

                  <div className="text-xs font-mono font-bold text-text-muted text-right">
                    {formatDuration(track.duration)}
                  </div>

                  <div className="relative flex items-center justify-center">
                    {backupStatus === "pending" && (
                      <RotateCw className="animate-spin text-primary" />
                    )}

                    {backupStatus === "complete" && (
                      <div className="p-2">
                        <CheckCircle2Icon size={20} className="text-primary" />
                      </div>
                    )}

                    {backupStatus === "failed" && (
                      <div className="p-2" onClick={(e) => {
                        e.stopPropagation();
                        removeTrackFromBackUp(track.id);
                        delete backupStatuses[track.id];
                        setBackupStatuses({...backupStatuses});
                      }}>
                        <XIcon size={20} className="text-red-500" />
                      </div>
                    )}

                    {!backupStatus && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTrackBackUp(track);
                        }}
                        className="p-2 rounded-xl hover:bg-bgMain text-text-muted transition-colors"
                        title="Back Up to Cloud"
                      >
                        <UploadCloud size={20} />
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(
                          activeMenu === track.id ? null : track.id
                        );
                      }}
                      className="p-2 rounded-xl hover:bg-bgMain text-text-muted transition-colors"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {activeMenu === track.id && (
                      <div
                        className="absolute right-full top-0 mr-3 w-52 bg-surface border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden p-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setSongToAction(track.id);
                            setActiveMenu(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-text-main hover:bg-primary/5 rounded-xl transition-colors"
                        >
                          <ListMusic size={16} className="text-primary" />
                          Add to Playlist
                        </button>

                        <button
                          onClick={() => {
                            handleTrackBackUp(track);
                            setActiveMenu(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-text-main hover:bg-primary/5 rounded-xl transition-colors"
                        >
                          <UploadCloud size={16} className="text-primary" />
                          {track.is_backed_up
                            ? "Sync Complete"
                            : "Cloud Backup"}
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-white/5 my-1 mx-2" />

                        <button
                          onClick={() => handleDelete(track.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 size={16} />
                          {collectionData.type === "Playlist"
                            ? "Remove from List"
                            : "Delete Permanent"}
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
    </>
  );
};

export default CollectionPage;
