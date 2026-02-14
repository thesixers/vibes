import React, { useState } from "react";
import { X, Music, Sparkles } from "lucide-react";
import { useSync } from "../context/SyncContext";
import { db } from "../data/db";
import { motion } from "framer-motion";

const PlaylistForm = () => {
  const { showPlaylistForm, setShowPlaylistForm } = useSync();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const createPlaylist = async () => {
    if (!name) return; // Simple validation

    setCreating(true);
    try {
      await db.playlists.add({
        title: name,
        song_ids: [],
        created_at: String(Date.now()),
        updated_at: String(Date.now()),
      });
      // Success feedback or logic here if needed
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
      setShowPlaylistForm(false);
      setName("");
    }
  };

  // If hidden, return nothing (Parent AnimatePresence handles exit if wrapped, otherwise instant unmount)
  if (!showPlaylistForm) return null;

  return (
    <div className="fixed inset-0 z-[120] flex justify-center items-center p-4">
      
      {/* 1. Backdrop (Blurry & Dark) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowPlaylistForm(false)}
      />

      {/* 2. Modal Card */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-sm bg-surface dark:bg-[#181818] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 pb-2 flex justify-between items-start">
            <div className="flex flex-col gap-1">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-bold text-text-main">New Vibe</h2>
                <p className="text-xs text-text-muted">Create a collection for your mood.</p>
            </div>
            <button
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-text-muted hover:text-text-main transition-colors"
                onClick={() => setShowPlaylistForm(false)}
            >
                <X size={20} />
            </button>
        </div>

        {/* Input Section */}
        <div className="p-6 pt-2 flex flex-col gap-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Music size={18} className="text-text-muted group-focus-within:text-primary transition-colors" />
            </div>
            <input
                type="text"
                autoFocus
                className="w-full pl-11 pr-4 py-4 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-primary/50 outline-none rounded-2xl text-text-main placeholder:text-text-muted/50 font-medium transition-all focus:bg-white dark:focus:bg-black/20 focus:shadow-sm focus:ring-4 focus:ring-primary/10"
                placeholder="My Awesome Playlist..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createPlaylist()}
            />
          </div>

          <button
            className={`w-full py-4 rounded-xl font-bold text-white shadow-soft transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                creating || !name 
                ? "bg-slate-300 dark:bg-white/10 text-text-muted cursor-not-allowed shadow-none" 
                : "bg-primary hover:brightness-110 hover:-translate-y-1"
            }`}
            onClick={createPlaylist}
            disabled={creating || !name}
          >
            {creating ? (
                <span className="animate-pulse">Creating...</span>
            ) : (
                "Create Playlist"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PlaylistForm;