import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, X, Music } from 'lucide-react';
import { formatDuration } from '../data/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Queue = ({ isOpen, onClose }) => {
  const { queue, currentTrack, playPlaylist, isPlaying } = usePlayer();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-28 right-4 md:right-6 w-[90vw] md:w-96 max-h-[60vh] bg-surface dark:bg-[#151515] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden z-50"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-surface/80 backdrop-blur-md sticky top-0 z-10">
            <div>
              <h3 className="font-bold text-lg text-text-main">Up Next</h3>
              <p className="text-xs text-text-muted font-medium">{queue.length} Tracks</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-text-muted hover:text-text-main transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Queue List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {queue.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-text-muted gap-3">
                <div className="p-4 rounded-full bg-slate-50 dark:bg-white/5">
                    <Music size={24} className="opacity-50" />
                </div>
                <span className="text-sm font-medium">Queue is empty</span>
              </div>
            ) : (
              queue.map((track, index) => {
                const isCurrent = currentTrack?.id === track.id;

                return (
                  <motion.div
                    key={`${track.id}-${index}`}
                    layout // Animates list reordering
                    onClick={() => playPlaylist(queue, index)}
                    className={`flex items-center gap-3 p-2 rounded-2xl cursor-pointer transition-all group ${
                      isCurrent 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {/* Image & Active State */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-white/10">
                      {track.images?.[0]?.url || track.album?.images?.[0]?.url ? (
                          <img 
                            src={track.images?.[0]?.url || track.album?.images?.[0]?.url} 
                            alt={track.title} 
                            className="w-full h-full object-cover"
                          />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center"><Music size={16} className="text-text-muted"/></div>
                      )}

                      {/* Playing Animation Overlay */}
                      {isCurrent && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          {isPlaying ? (
                            <div className="flex gap-1 items-end h-3">
                              <div className="w-1 h-full bg-primary animate-[bounce_1s_infinite]" />
                              <div className="w-1 h-2/3 bg-primary animate-[bounce_1.2s_infinite]" />
                              <div className="w-1 h-full bg-primary animate-[bounce_0.8s_infinite]" />
                            </div>
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold truncate ${isCurrent ? 'text-primary' : 'text-text-main'}`}>
                        {track.title}
                      </h4>
                      <p className={`text-xs truncate font-medium ${isCurrent ? 'text-primary/70' : 'text-text-muted'}`}>
                        { track.artists?.map((artist) => artist.name).join(', ')}
                      </p>
                    </div>

                    {/* Duration */}
                    <div className={`text-xs font-mono px-2 ${isCurrent ? 'text-primary' : 'text-text-muted'}`}>
                      { formatDuration(track.duration) }
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Queue;