import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks'; 
import { Search as SearchIcon, X, Play, Mic2, Disc, ListMusic, Music, TrendingUp, ChevronRight } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { db } from '../data/db';
import { formatDuration } from '../data/utils';
import { motion, AnimatePresence } from 'framer-motion';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  const results = useLiveQuery(async () => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const [artists, albums, playlists, rawSongs] = await Promise.all([
      db.artists.filter(a => a.name.toLowerCase().includes(q)).limit(4).toArray(),
      db.albums.where("type").anyOf("album").filter(a => a.title.toLowerCase().includes(q)).limit(4).toArray(),
      db.playlists.filter(p => p.title.toLowerCase().includes(q)).limit(4).toArray(),
      db.songs.filter(s => s.title.toLowerCase().includes(q)).limit(8).toArray(),
    ]);

    const songs = await Promise.all(rawSongs.map(async (song) => {
      const album = await db.albums.get(song.album_id);
      return { ...song, album };
    }));

    return { artists, albums, playlists, songs };
  }, [query]);

  return (
    <div className="flex-1 flex flex-col bg-bgMain pb-32">
      
      {/* --- REFINED SEARCH HEADER --- */}
      <div className="sticky top-0 z-30 pt-6 pb-8 bg-bgMain/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl relative group"
        >
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
            <SearchIcon size={20} strokeWidth={2.5} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search catalog..."
            className="w-full bg-surface border border-slate-200 dark:border-white/10 rounded-xl pl-14 pr-14 py-4 text-base font-bold text-text-main shadow-sm focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all"
            autoFocus
          />

          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-text-muted hover:text-primary transition-all"
              >
                <X size={18} strokeWidth={2.5} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="flex-1 py-10 px-2">
        <AnimatePresence mode="wait">
          {results ? (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              
              {/* 1. TRACKS (Refined List) */}
              <section className="lg:col-span-8 space-y-6">
                <div className="flex items-center gap-3 px-2">
                   <div className="h-4 w-1 bg-primary rounded-full" />
                   <h2 className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Tracks</h2>
                </div>
                <div className="space-y-1">
                  {results.songs.map((song, i) => {
                     const isCurrent = currentTrack?.id === song.id;
                     return (
                        <div
                          key={song.id}
                          onClick={async () => {
                            const artists = await db.artists.bulkGet(song.artist_ids);
                            playTrack({...song, artists});
                          }}
                          className={`group flex items-center gap-5 p-3 rounded-xl cursor-pointer transition-all border ${
                            isCurrent 
                            ? "bg-surface border-primary/20 shadow-sm" 
                            : "border-transparent hover:bg-surface hover:border-slate-100 dark:hover:border-white/5"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-white/10 relative">
                            <img src={song.images?.[2]?.url || song.album?.images?.[2]?.url} className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 bg-primary/20 flex items-center justify-center transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                <Play size={16} fill="white" className="text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-bold truncate ${isCurrent ? "text-primary" : "text-text-main"}`}>{song.title}</h4>
                            <p className="text-[10px] font-black uppercase tracking-wider text-text-muted truncate">
                              {song.artists?.map(a => a.name).join(', ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono font-bold text-text-muted">{formatDuration(song.duration)}</span>
                            <ChevronRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-all" />
                          </div>
                        </div>
                      );
                  })}
                </div>
              </section>

              {/* 2. ARTISTS (Mature Minimal) */}
              <section className="lg:col-span-4 space-y-6">
                <div className="flex items-center gap-3 px-2">
                   <div className="h-4 w-1 bg-slate-200 dark:bg-white/10 rounded-full" />
                   <h2 className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Artists</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {results.artists.map((artist, i) => (
                      <motion.div 
                        key={artist.id}
                        whileHover={{ y: -4 }}
                        onClick={() => navigate(`/artist/${artist.id}`)}
                        className="flex flex-col items-center justify-center p-6 bg-surface border border-slate-100 dark:border-white/5 rounded-2xl hover:border-primary/20 transition-all shadow-sm cursor-pointer"
                      >
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-slate-100 dark:border-white/5 grayscale-[30%] hover:grayscale-0 transition-all duration-500">
                          <img src={artist.images?.[0]?.url} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-text-main text-[11px] uppercase tracking-tight text-center line-clamp-1">{artist.name}</h3>
                      </motion.div>
                    ))}
                </div>
              </section>

              {/* 3. COLLECTIONS (Industrial Grid) */}
              <section className="lg:col-span-12 mt-4 space-y-6">
                <div className="h-px bg-slate-100 dark:bg-white/5 w-full" />
                <h2 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] px-2">Releases & Playlists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                    {[...results.albums, ...results.playlists].map((item, i) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        onClick={() => navigate(`/playlist/${item.id}`)}
                        className="group cursor-pointer space-y-3"
                      >
                        <div className="aspect-square rounded-xl overflow-hidden bg-surface border border-slate-100 dark:border-white/5 shadow-sm">
                           <img src={item.images?.[0]?.url || item.cover_image?.url || item.cover_image_path} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <h3 className="font-bold text-text-main text-[11px] uppercase truncate tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
                      </motion.div>
                    ))}
                </div>
              </section>
   
            </motion.div>
          ) : (
            /* --- MATURE IDLE STATE --- */
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <div className="w-20 h-20 rounded-2xl border-2 border-slate-100 dark:border-white/5 flex items-center justify-center text-text-muted mb-8">
                <SearchIcon size={32} strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-black text-text-main mb-2 tracking-[0.2em] uppercase">Search Library</h2>
              <p className="text-[11px] text-text-muted max-w-xs font-bold uppercase tracking-widest">Type to explore your indexed media</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchPage;