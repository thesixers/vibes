import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, X } from 'lucide-react';
import { mockAlbums } from '../data/mockData';

const Queue = ({ isOpen, onClose }) => {
  const { queue, currentTrack, playPlaylist, isPlaying, togglePlay } = usePlayer();

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-24 right-6 w-96 max-h-[calc(100vh-200px)] glass-strong rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 z-50">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-xl">
        <h3 className="font-bold text-lg">Queue</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} className="text-white/70" />
        </button>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {queue.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-white/40 text-sm">
            Queue is empty
          </div>
        ) : (
          <div className="space-y-1">
            {queue.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;
              const album = mockAlbums.find(a => a.id === track.album_id);

              return (
                <div
                  key={`${track.id}-${index}`}
                  onClick={() => playPlaylist(queue, index)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer group transition-colors ${
                    isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={album?.cover_image_path} 
                      alt={track.title} 
                      className="w-full h-full object-cover"
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        {isPlaying ? (
                          <div className="flex gap-0.5 items-end h-3">
                            <div className="w-0.5 h-full bg-purple-electric animate-bounce" />
                            <div className="w-0.5 h-2/3 bg-purple-electric animate-bounce [animation-delay:0.2s]" />
                            <div className="w-0.5 h-full bg-purple-electric animate-bounce [animation-delay:0.4s]" />
                          </div>
                        ) : (
                          <Play size={12} className="text-white ml-0.5" fill="white" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium truncate ${isCurrent ? 'text-purple-electric' : 'text-white'}`}>
                      {track.title}
                    </h4>
                    <p className="text-xs text-white/50 truncate">
                      {track.artists.join(', ')}
                    </p>
                  </div>

                  <div className="text-xs text-white/40">
                    {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Queue;
