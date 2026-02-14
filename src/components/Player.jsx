import React, { useState } from "react";
import {
  Play,
  Pause,
  Repeat1,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Shuffle,
  ListMusic,
  ChevronDown,
  Plus,
  Music,
  Maximize2
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import Queue from "./Queue";
import { formatDuration } from "../data/utils";
import AddtoPlayList from "./AddtoPlayList";
import { motion, AnimatePresence } from "framer-motion";

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    volume,
    setVolume,
    togglePlay,
    seek,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    isShuffling,
    isRepeating,
  } = usePlayer();

  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [songToAction, setSongToAction] = useState(null);

  const getCurrentTime = () => {
    if (!currentTrack) return 0;
    const totalSeconds = currentTrack.duration / 1000;
    return (progress / 100) * totalSeconds * 1000;
  };

  if (!currentTrack) return null;

  const bgImage = currentTrack.images?.[0]?.url || currentTrack.album?.images?.[0]?.url;
  const smallImage = currentTrack.images?.[2]?.url || currentTrack.album?.images?.[1]?.url;

  return (
    <>
      <AnimatePresence>
        {songToAction && <AddtoPlayList songToAction={songToAction} setSongToAction={setSongToAction} />}
      </AnimatePresence>
      <Queue isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />

      {/* --- 1. EXPANDED PLAYER (SHARP EDGES & BLUR) --- */}
      <div
        className={`fixed inset-0 z-[100] transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${
          isExpanded ? "translate-y-0" : "translate-y-full"
        } bg-[#0A0A0A] flex flex-col`}
      >
        {/* Background Blur */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {bgImage && (
            <img
              src={bgImage}
              alt=""
              className="w-full h-full object-cover blur-[100px] opacity-30 scale-150 grayscale-[20%]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A]" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex justify-between items-center p-6 md:p-10">
          <button onClick={() => setIsExpanded(false)} className="p-3 bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
            <ChevronDown size={28} />
          </button>
          <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">Now Playing</span>
          <button onClick={() => setIsQueueOpen(true)} className="p-3 bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
            <ListMusic size={22} />
          </button>
        </div>

        {/* Center Canvas - SHARP ART */}
        <div className="relative z-10 flex-1 flex items-center justify-center min-h-0 pb-32 px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isExpanded ? { opacity: 1 } : {}}
            className="relative w-full aspect-square max-w-[420px] shadow-2xl bg-surface border-4 border-white/10"
          >
            {bgImage ? (
              <img src={bgImage} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/10"><Music size={80} /></div>
            )}
          </motion.div>
        </div>

        {/* Bottom Info & Progress */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-10 pb-16 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent">
          <div className="max-w-3xl mx-auto w-full space-y-8">
            <div className="flex flex-col items-start space-y-2">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">{currentTrack.title}</h2>
              <p className="text-sm md:text-lg font-bold text-primary uppercase tracking-widest">
                {currentTrack.artists.map((a) => a.name).join(" / ")}
              </p>
            </div>

            {/* Scrubber */}
            <div className="space-y-4">
              <div className="h-1 bg-white/10 cursor-pointer relative flex items-center" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  seek(((e.clientX - rect.left) / rect.width) * 100);
              }}>
                <div className="h-full bg-primary relative" style={{ width: `${progress}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white shadow-xl" />
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-black text-white/30 font-mono tracking-[0.2em] uppercase">
                <span>{formatDuration(getCurrentTime())}</span>
                <span>{formatDuration(currentTrack.duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. MINIMIZED PLAYER (SHARP & COMPACT) --- */}
      <div
        className="w-full h-[80px] bg-surface/95 backdrop-blur-md border border-slate-100 dark:border-white/10 shadow-lg flex items-center px-6 transition-all group relative cursor-pointer"
        onClick={(e) => {
          if (!e.target.closest("button") && !e.target.closest(".volume-slider") && !e.target.closest(".seek-bar"))
            setIsExpanded(true);
        }}
      >
        {/* Progress Header */}
        <div 
          className="seek-bar absolute top-0 left-0 right-0 h-[3px] cursor-pointer group/seek overflow-hidden z-20"
          onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              seek(((e.clientX - rect.left) / rect.width) * 100);
          }}
        >
          <div className="absolute inset-0 bg-slate-200 dark:bg-white/5" />
          <div className="h-full bg-primary transition-all duration-300 relative" style={{ width: `${progress}%` }} />
        </div>

        {/* Info & Art */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="h-12 w-12 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden shrink-0">
             {smallImage ? (
               <img src={smallImage} className={`w-full h-full object-cover ${isPlaying ? 'grayscale-0' : 'grayscale-[40%]'}`} alt="" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-text-muted/20"><Music size={18}/></div>
             )}
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h4 className="text-sm font-bold text-text-main truncate uppercase tracking-tight leading-none">{currentTrack.title}</h4>
            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest truncate mt-1">
               {currentTrack.artists.map((a) => a.name).join(" / ")}
            </p>
          </div>
          {/* Add to Playlist - Restored */}
          <button onClick={(e) => { e.stopPropagation(); setSongToAction(currentTrack.id); }} className="hidden md:flex text-text-muted hover:text-primary p-2">
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>

        {/* TRANSPORT & RESTORED MODES */}
        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
           <button onClick={(e) => { e.stopPropagation(); toggleShuffle(); }} className={`transition-colors ${isShuffling ? "text-primary" : "text-text-muted hover:text-text-main"}`}>
             <Shuffle size={16} />
           </button>

           <button onClick={(e) => { e.stopPropagation(); prevTrack(); }} className="text-text-muted hover:text-primary transition-colors">
              <SkipBack size={20} fill="currentColor" strokeWidth={0} />
           </button>

           <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="w-11 h-11 bg-text-main text-bgMain flex items-center justify-center hover:bg-primary hover:text-white transition-all">
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" /> }
           </button>

           <button onClick={(e) => { e.stopPropagation(); nextTrack(); }} className="text-text-muted hover:text-primary transition-colors">
              <SkipForward size={20} fill="currentColor" strokeWidth={0} />
           </button>

           <button onClick={(e) => { e.stopPropagation(); toggleRepeat(); }} className={`transition-colors ${isRepeating ? "text-primary" : "text-text-muted hover:text-text-main"}`}>
             {isRepeating ? <Repeat1 size={16} /> : <Repeat size={16} />}
           </button>
        </div>

        {/* Utilities */}
        <div className="flex items-center gap-6 justify-end">
           <div className="hidden lg:flex items-center gap-3 w-28 group/vol volume-slider">
             <Volume2 size={16} className="text-text-muted" />
             <div className="flex-1 h-1 bg-slate-200 dark:bg-white/5 cursor-pointer overflow-hidden" onClick={(e) => {
                 e.stopPropagation();
                 const rect = e.currentTarget.getBoundingClientRect();
                 setVolume(((e.clientX - rect.left) / rect.width) * 100);
               }}>
               <div className="h-full bg-text-muted group-hover/vol:bg-primary transition-colors" style={{ width: `${volume}%` }} />
             </div>
           </div>
           <button onClick={(e) => { e.stopPropagation(); setIsQueueOpen(!isQueueOpen); }} className={`p-2 border transition-all ${isQueueOpen ? "border-primary text-primary bg-primary/5" : "border-transparent text-text-muted hover:text-text-main"}`}>
             <ListMusic size={18} />
           </button>
        </div>
      </div>
    </>
  );
};

export default Player;