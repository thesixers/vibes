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

  const bgImage =
    currentTrack.images?.[0]?.url || currentTrack.album?.images?.[0]?.url;
  const smallImage =
    currentTrack.images?.[2]?.url || currentTrack.album?.images?.[1]?.url;

  return (
    <>
      <AnimatePresence>
        {songToAction && (
          <AddtoPlayList
            songToAction={songToAction}
            setSongToAction={setSongToAction}
          />
        )}
      </AnimatePresence>
      <Queue isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />

        {/* --- ULTRA-MINIMAL EXPANDED PLAYER --- */}
      <div
        className={`fixed inset-0 z-[70] transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${
          isExpanded ? "translate-y-0" : "translate-y-full"
        } bg-[#121212] flex flex-col`}
      >
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {bgImage && (
            <img
              src={bgImage}
              alt=""
              className="w-full h-full object-cover blur-3xl opacity-40 scale-125"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/30 to-[#121212]" />
        </div>

        {/* Header (Top) */}
        <div className="relative z-10 flex justify-between items-center p-6 md:p-8 pt-10">
          <button
            onClick={() => setIsExpanded(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <ChevronDown size={28} strokeWidth={1.5} />
          </button>
          <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
            Now Playing
          </span>
          <button
            onClick={() => setIsQueueOpen(true)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <ListMusic size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* Center: Album Art */}
        <div className="relative z-10 flex-1 flex items-center justify-center min-h-0 pb-32 px-8">
          <div className="relative w-full aspect-square max-w-[400px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden">
            {bgImage ? (
              <img
                src={bgImage}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <Music size={80} className="text-white/20" />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Info & Progress ONLY */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 pb-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
            {/* Title & Artist */}
            <div className="flex flex-col items-start">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                {currentTrack.title}
              </h2>
              <p className="text-lg md:text-xl text-white/60 mt-1 font-medium">
                {currentTrack.artists.map((a) => a.name).join(", ")}
              </p>
            </div>

            {/* Scrubber */}
            <div className="group w-full space-y-2 mt-4">
              <div
                className="h-1.5 bg-white/10 rounded-full cursor-pointer relative py-2 -my-2 flex items-center"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  seek(((e.clientX - rect.left) / rect.width) * 100);
                }}
              >
                <div className="absolute inset-x-0 h-1.5 bg-white/20 rounded-full pointer-events-none" />
                <div
                  className="h-1.5 bg-white rounded-full transition-all duration-100 relative pointer-events-none"
                  style={{ width: `${progress}%` }}
                >
                  {/* Small dot at end of bar */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
                </div>
              </div>

              <div className="flex justify-between text-xs font-medium text-white/50 font-mono tracking-wide">
                <span>{formatDuration(getCurrentTime())}</span>
                <span>{formatDuration(currentTrack.duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {/* --- 2. MINIMIZED PLAYER (DYNAMIC FLEX LAYOUT) --- */}
      <div
        className="w-full h-[80px] bg-surface/95 backdrop-blur-md border border-slate-100 dark:border-white/10 shadow-lg flex items-center px-6 transition-all group relative cursor-pointer"
        onClick={(e) => {
          if (
            !e.target.closest("button") &&
            !e.target.closest(".volume-slider") &&
            !e.target.closest(".seek-bar")
          )
            setIsExpanded(true);
        }}
      >
        <div
          className="seek-bar absolute top-0 left-0 right-0 h-[3px] cursor-pointer group/seek overflow-hidden z-20"
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            seek(((e.clientX - rect.left) / rect.width) * 100);
          }}
        >
          <div className="absolute inset-0 bg-slate-200 dark:bg-white/5" />
          <div
            className="h-full bg-primary transition-all duration-300 relative"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 1. LEFT COLUMN: Track Info (Flexible/Shrinkable) */}
        <div className="flex items-center gap-4 flex-[1.5] min-w-0 pr-4">
          <div className="h-12 w-12 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden shrink-0">
            {smallImage ? (
              <img
                src={smallImage}
                className={`w-full h-full object-cover ${
                  isPlaying ? "grayscale-0" : "grayscale-[40%]"
                }`}
                alt=""
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted/20">
                <Music size={18} />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h4 className="text-sm font-bold text-text-main truncate uppercase tracking-tight leading-none">
              {currentTrack.title}
            </h4>
            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest truncate mt-1">
              {currentTrack.artists.map((a) => a.name).join(" / ")}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSongToAction(currentTrack.id);
            }}
            className="hidden lg:flex text-text-muted hover:text-primary p-2 shrink-0"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        </div>

        {/* 2. MIDDLE COLUMN: Transport (Fixed/Centered) */}
        <div className="hidden md:flex items-center justify-center gap-8 flex-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleShuffle();
            }}
            className={`transition-colors shrink-0 ${
              isShuffling
                ? "text-primary"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            <Shuffle size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevTrack();
            }}
            className="text-text-muted hover:text-primary transition-colors shrink-0"
          >
            <SkipBack size={20} fill="currentColor" strokeWidth={0} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-11 h-11 bg-text-main text-bgMain flex items-center justify-center hover:bg-primary hover:text-white transition-all shrink-0"
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextTrack();
            }}
            className="text-text-muted hover:text-primary transition-colors shrink-0"
          >
            <SkipForward size={20} fill="currentColor" strokeWidth={0} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleRepeat();
            }}
            className={`transition-colors shrink-0 ${
              isRepeating
                ? "text-primary"
                : "text-text-muted hover:text-text-main"
            }`}
          >
            {isRepeating ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>
        </div>

        {/* 3. RIGHT COLUMN: Utilities (Static) */}
        <div className="flex items-center gap-6 flex-[1.5] justify-end pl-4">
          {/* Mobile Play Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="md:hidden w-10 h-10 bg-primary text-white flex items-center justify-center shadow-md active:scale-90 transition-all"
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          <div className="hidden lg:flex items-center gap-3 w-28 group/vol volume-slider shrink-0">
            <Volume2 size={16} className="text-text-muted" />
            <div
              className="flex-1 h-1 bg-slate-200 dark:bg-white/5 cursor-pointer overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                setVolume(((e.clientX - rect.left) / rect.width) * 100);
              }}
            >
              <div
                className="h-full bg-text-muted group-hover/vol:bg-primary transition-colors"
                style={{ width: `${volume}%` }}
              />
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsQueueOpen(!isQueueOpen);
            }}
            className={`hidden md:flex p-2 border transition-all shrink-0 ${
              isQueueOpen
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-text-muted hover:text-text-main"
            }`}
          >
            <ListMusic size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Player;
