import React, { useState } from 'react';
import { Play, Pause, Repeat1, SkipBack, SkipForward, Volume2, Heart, Repeat, Shuffle, ListMusic, ArrowRight  } from 'lucide-react';

import { usePlayer } from '../context/PlayerContext';
import { mockAlbums } from '../data/mockData';
import { Music } from 'lucide-react';
import Queue from './Queue';

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
    isRepeating
  } = usePlayer();

  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const currentAlbum = currentTrack ? mockAlbums.find(a => a.id === currentTrack.album_id) : null;

  return (
    <>
      <Queue isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      
      <div className="h-24 glass-strong border-t border-white/10 flex items-center px-6 gap-6 relative z-[60]">
        {/* Track Info */}
        <div className="flex items-center gap-4 w-64">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-electric to-purple-glow shadow-glow-purple flex items-center justify-center overflow-hidden">
            {currentAlbum ? (
              <img src={currentAlbum.cover_image_path} alt={currentAlbum.title} className="w-full h-full object-cover" />
            ) : (
              <Music size={24} className="text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">
              {currentTrack ? currentTrack.title : 'No track selected'}
            </h4>
            <p className="text-xs text-white/60 truncate">
              {currentTrack ? currentTrack.artists.join(', ') : 'Select a song to play'}
            </p>
          </div>
          <button className="hover:scale-110 transition-transform">
            <Heart 
              size={18} 
              className={`${currentTrack?.is_liked ? 'text-purple-electric fill-purple-electric' : 'text-white/40'}`} 
            />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleShuffle}
              className={`transition-colors ${isShuffling ? 'text-purple-electric' : 'text-white/60 hover:text-white'}`}
            >
              <Shuffle size={18} />
            </button>
            <button 
              onClick={prevTrack}
              className="text-white/60 hover:text-white transition-colors"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              disabled={!currentTrack}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
            >
              {isPlaying ? (
                <Pause size={20} className="text-void" fill="currentColor" />
              ) : (
                <Play size={20} className="text-void ml-0.5" fill="currentColor" />
              )}
            </button>
            <button 
              onClick={nextTrack}
              className="text-white/60 hover:text-white transition-colors"
            >
              <SkipForward size={20} />
            </button>
            <button 
              onClick={toggleRepeat}
              className={`transition-colors ${isRepeating ? 'text-purple-electric' : 'text-white/60 hover:text-white'}`}
            >
              {isRepeating ? <Repeat1 size={18} /> : <Repeat size={18} />}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-2xl flex items-center gap-3">
            <span className="text-xs text-white/50 w-10 text-right">
              {currentTrack ? `${Math.floor((progress / 100 * currentTrack.duration) / 60)}:${String(Math.floor((progress / 100 * currentTrack.duration) % 60)).padStart(2, '0')}` : '0:00'}
            </span>
            <div 
              className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden group cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                seek((x / rect.width) * 100);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-purple-electric to-purple-glow relative transition-all duration-100"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-glow-purple" />
              </div>
            </div>
            <span className="text-xs text-white/50 w-10">
              {currentTrack ? `${Math.floor(currentTrack.duration / 60)}:${String(currentTrack.duration % 60).padStart(2, '0')}` : '0:00'}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 w-40 justify-end">
          <button 
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className={`transition-colors ${isQueueOpen ? 'text-purple-electric' : 'text-white/60 hover:text-white'}`}
          >
            <ListMusic size={20} />
          </button>
          
          <div className="flex items-center gap-2 flex-1">
            <Volume2 size={18} className="text-white/60" />
            <div 
              className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden group cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                setVolume((x / rect.width) * 100);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-purple-electric to-purple-glow relative"
                style={{ width: `${volume}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;
