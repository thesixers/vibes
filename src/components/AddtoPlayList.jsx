import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../data/db";
import { useSync } from "../context/SyncContext";
import PlaylistForm from "./PlaylistForm";
import { Check, Music, X, Plus, ListMusic } from "lucide-react";
import { motion } from "framer-motion";

export default function AddtoPlayList({ songToAction, setSongToAction }) {
  const { setShowPlaylistForm, showPlaylistForm } = useSync();
  const allPlaylists = useLiveQuery(() => db.playlists.toArray()) || [];

  const handleTogglePlaylist = async (playlist) => {
    if (!songToAction) return;
    try {
      const currentSongs = playlist.song_ids || [];
      const isIncluded = currentSongs.includes(songToAction);
      let newSongs = isIncluded
        ? currentSongs.filter((id) => id !== songToAction)
        : [...currentSongs, songToAction];

      await db.playlists.update(playlist.id, { song_ids: newSongs });
    } catch (error) {
      console.error("Failed to update playlist:", error);
    }
  };

  if (!songToAction) return;
  
  return (
    <>
      {showPlaylistForm && <PlaylistForm />}

      {/* BACKDROP */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setSongToAction(null)}
      >
        {/* MODAL CARD */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-surface border border-slate-200 dark:border-white/10 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                    <ListMusic size={18} />
                </div>
                <h3 className="text-lg font-bold text-text-main">Add to Playlist</h3>
            </div>
            <button
              onClick={() => setSongToAction(null)}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-text-muted hover:text-text-main transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Playlist List */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar p-3 space-y-1">
            {allPlaylists.length === 0 ? (
                <div className="p-8 text-center text-text-muted flex flex-col items-center gap-2">
                    <Music size={32} className="opacity-20" />
                    <p className="text-sm">No playlists found.</p>
                </div>
            ) : (
                allPlaylists.map((pl) => {
                  const isIncluded = pl.song_ids?.includes(songToAction);
                  
                  return (
                    <button
                        key={pl.id}
                        onClick={() => handleTogglePlaylist(pl)}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left group border ${
                            isIncluded 
                            ? "bg-primary/5 border-primary/20" 
                            : "hover:bg-slate-50 dark:hover:bg-white/5 border-transparent"
                        }`}
                    >
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/10 overflow-hidden flex-shrink-0 relative shadow-sm">
                        {pl.cover_image?.url ? (
                            <img src={pl.cover_image.url} className="w-full h-full object-cover" alt={pl.title} />
                        ) : (
                            <Music className="w-5 h-5 m-auto absolute inset-0 text-text-muted" />
                        )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className={`font-bold truncate ${isIncluded ? "text-primary" : "text-text-main"}`}>
                                {pl.title}
                            </p>
                            <p className="text-xs text-text-muted font-medium">
                                {pl.song_ids ? pl.song_ids.length : 0} tracks
                            </p>
                        </div>

                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                            isIncluded 
                             ? "bg-primary border-primary text-white scale-100" 
                             : "border-slate-300 dark:border-white/20 text-transparent scale-90 group-hover:border-primary/50"
                        }`}>
                            <Check size={14} strokeWidth={3} />
                        </div>
                    </button>
                  );
                })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
            <button
              onClick={() => setShowPlaylistForm(true)}
              className="w-full flex items-center justify-center gap-2 bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-text-main py-3 rounded-xl font-bold border border-slate-200 dark:border-white/10 shadow-sm transition-all hover:-translate-y-0.5"
            >
              <Plus size={18} className="text-primary" />
              <span>New Playlist</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}