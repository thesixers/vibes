import React, { useState } from 'react';
import { 
  Play, Pause, Repeat1, SkipBack, SkipForward, Volume2, 
  Repeat, Shuffle, ListMusic, ChevronUp, ChevronDown, 
  Plus, X, Music
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { usePlayer } from '../context/PlayerContext';
import Queue from './Queue';
import { db } from '../data/db';
import { formatDuration } from '../data/utils'; 

const Player = () => {
  const { 
    currentTrack, isPlaying, progress, volume, setVolume, 
    togglePlay, seek, nextTrack, prevTrack, toggleShuffle, 
    toggleRepeat, isShuffling, isRepeating
  } = usePlayer();

  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);

  const playlists = useLiveQuery(() => db.playlists.toArray()) || [];

  const getCurrentTime = () => {
    if (!currentTrack) return 0;
    const totalSeconds = currentTrack.duration / 1000;
    return (progress / 100) * totalSeconds * 1000;
  };

  // ... Playlist Logic ...
  const addToPlaylist = async (playlistId) => { /* ... */ };
  const createNewPlaylist = async () => { /* ... */ };

  if (!currentTrack) return null;

  const bgImage = currentTrack.images?.[0]?.url || currentTrack.album?.images?.[0]?.url;
  const smallImage = currentTrack.images?.[2]?.url || currentTrack.images?.[1]?.url || currentTrack.album?.images?.[1]?.url;

  return (
    <>
      <Queue isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      
      {/* Playlist Selector Modal (Hidden) */}
      {showPlaylistSelector && ( null )}

      {/* --- ✅ ULTRA-MINIMAL EXPANDED PLAYER --- */}
      <div 
        className={`fixed inset-0 z-[70] transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${
          isExpanded ? 'translate-y-0' : 'translate-y-full'
        } bg-[#121212] flex flex-col`}
      >
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
            {bgImage && (
                <img src={bgImage} alt="" className="w-full h-full object-cover blur-3xl opacity-40 scale-125" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/30 to-[#121212]" />
        </div>

        {/* Header (Top) */}
        <div className="relative z-10 flex justify-between items-center p-6 md:p-8 pt-10">
            <button onClick={() => setIsExpanded(false)} className="text-white/60 hover:text-white transition-colors">
                <ChevronDown size={28} strokeWidth={1.5} />
            </button>
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Now Playing</span>
            <button onClick={() => setIsQueueOpen(true)} className="text-white/60 hover:text-white transition-colors">
                <ListMusic size={22} strokeWidth={1.5} />
            </button>
        </div>

        {/* Center: Album Art */}
        <div className="relative z-10 flex-1 flex items-center justify-center min-h-0 pb-32 px-8">
            <div className="relative w-full aspect-square max-w-[400px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden">
                {bgImage ? (
                    <img src={bgImage} alt={currentTrack.title} className="w-full h-full object-cover" />
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
                        {currentTrack.artists.map(a => a.name).join(', ')}
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

      {/* --- MINIMIZED PLAYER (Unchanged - Needed for controls when collapsed) --- */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-20 md:h-24 bg-[#121212] border-t border-white/5 flex items-center px-4 md:px-6 gap-4 z-[60] transition-all cursor-pointer md:cursor-default group"
        onClick={(e) => {
          if (window.innerWidth < 768 && !e.target.closest('button')) setIsExpanded(true);
        }}
      >
        <div className="absolute -top-[2px] left-0 right-0 h-[2px] bg-transparent group-hover:h-[4px] transition-all md:hidden">
             <div className="h-full bg-white" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center gap-3 md:gap-4 w-1/2 md:w-1/4 min-w-0">
           <div className="w-12 h-12 md:w-14 md:h-14 rounded bg-white/5 flex-shrink-0 overflow-hidden relative group/art">
             {smallImage ? (
               <>
                <img src={smallImage} alt="" className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}
                  className="absolute inset-0 bg-black/40 hidden md:flex items-center justify-center opacity-0 group-hover/art:opacity-100 transition-opacity"
                >
                  <ChevronUp size={24} className="text-white" />
                </button>
               </>
             ) : (
               <Music className="w-1/2 h-1/2 m-auto text-white/20" />
             )}
           </div>
           <div className="min-w-0 flex-1">
             <h4 className="text-sm font-medium text-white truncate">{currentTrack.title}</h4>
             <p className="text-xs text-white/60 truncate">{currentTrack.artists.map(a => a.name).join(', ')}</p>
           </div>
           <button onClick={(e) => { e.stopPropagation(); setShowPlaylistSelector(true); }} className="hidden md:block text-white/40 hover:text-white p-2"><Plus size={18} /></button>
        </div>

        <div className="hidden md:flex flex-1 flex-col items-center gap-2 max-w-xl">
          <div className="flex items-center gap-6">
            <button onClick={toggleShuffle} className={`text-sm ${isShuffling ? 'text-purple-electric' : 'text-white/40 hover:text-white'}`}><Shuffle size={16} /></button>
            <button onClick={prevTrack} className="text-white hover:text-white/70"><SkipBack size={20} fill="currentColor" /></button>
            <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={nextTrack} className="text-white hover:text-white/70"><SkipForward size={20} fill="currentColor" /></button>
            <button onClick={toggleRepeat} className={`text-sm ${isRepeating ? 'text-purple-electric' : 'text-white/40 hover:text-white'}`}>{isRepeating ? <Repeat1 size={16} /> : <Repeat size={16} />}</button>
          </div>
          <div className="w-full flex items-center gap-3 text-xs font-medium text-white/40 font-mono">
            <span>{formatDuration(getCurrentTime())}</span>
            <div className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer group/scrub" onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); seek(((e.clientX - rect.left) / rect.width) * 100); }}>
              <div className="h-full bg-white rounded-full relative group-hover/scrub:bg-purple-electric transition-colors" style={{ width: `${progress}%` }}></div>
            </div>
            <span>{formatDuration(currentTrack.duration)}</span>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-4 ml-auto pr-2">
           <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-white">
             {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
           </button>
        </div>
        
        <div className="hidden md:flex items-center gap-4 w-1/4 justify-end">
           <button onClick={() => setIsQueueOpen(!isQueueOpen)} className={isQueueOpen ? 'text-purple-electric' : 'text-white/60 hover:text-white'}><ListMusic size={18} /></button>
           <div className="flex items-center gap-2 w-24 group/vol">
             <Volume2 size={16} className="text-white/60" />
             <div className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer overflow-hidden" onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setVolume(((e.clientX - rect.left) / rect.width) * 100); }}>
               <div className="h-full bg-white/70 group-hover/vol:bg-purple-electric" style={{ width: `${volume}%` }} />
             </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default Player;