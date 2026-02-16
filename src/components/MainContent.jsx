import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks'; 
import { ChevronRight, Play, Music, Layers, Activity, ArrowRight } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { db } from '../data/db'; 
import { motion, AnimatePresence } from 'framer-motion';

const MainContent = () => {
  const navigate = useNavigate();
  const { playPlaylist, currentTrack, isPlaying } = usePlayer();
  const [currentSlide, setCurrentSlide] = useState(0);

  const data = useLiveQuery(async () => {
    const songs = await db.songs.limit(20).toArray(); 
    const recentSongs = songs.reverse().slice(0, 8);
    const playlists = await db.playlists.limit(4).toArray();
    const allArtists = await db.artists.limit(5).toArray();

    const hydratedSongs = await Promise.all(
      recentSongs.map(async (s) => {
        const artists = await db.artists.where('id').anyOf(s.artist_ids).toArray();
        const album = await db.albums.get(s.album_id);
        return { ...s, artists, album };
      })
    );

    return {
      recentSongs: hydratedSongs,
      playlists,
      featuredArtists: allArtists || []
    };
  });

  useEffect(() => {
    if (!data?.featuredArtists.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.featuredArtists.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [data?.featuredArtists.length]);

  if (!data) return (
    <div className="p-6 flex flex-col gap-4 sm:p-10">
      <div className="h-4 w-32 bg-slate-100 dark:bg-white/5 animate-pulse rounded" />
      <div className="h-[300px] sm:h-[350px] w-full bg-slate-100 dark:bg-white/5 animate-pulse rounded-2xl" />
    </div>
  );

  const { recentSongs, playlists, featuredArtists } = data;
  const currentArtist = featuredArtists[currentSlide];

  return (
    <div className="flex-1 flex flex-col gap-12 sm:gap-20 pb-24 sm:pb-32 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-0">

      {/* ARTIST SPOTLIGHT */}
      {currentArtist && (
        <section className="relative w-full h-[280px] sm:h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm group cursor-pointer bg-surface">
          <div className="absolute inset-0 z-0">
            {currentArtist.images?.[0]?.url ? (
              <img 
                src={currentArtist.images[0].url} 
                alt={currentArtist.name} 
                className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 scale-105" 
              />
            ) : <div className="w-full h-full bg-slate-50 dark:bg-white/5" />}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-bgMain via-bgMain/40 to-transparent" />
          <div className="relative h-full flex flex-col justify-end p-6 sm:p-12 z-10">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentArtist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 sm:space-y-6"
              >
                <span className="px-2 py-1 text-[9px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] text-primary border border-primary/20 bg-primary/5 rounded-md uppercase">
                  Artist Spotlight
                </span>
                <h1 className="text-3xl sm:text-6xl md:text-8xl font-black text-text-main leading-[1] sm:leading-[0.85] tracking-tighter uppercase max-w-full sm:max-w-4xl">
                  {currentArtist.name}
                </h1>
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/artist/${currentArtist.id}`); }}
                  className="flex items-center gap-3 sm:gap-4 text-[9px] sm:text-xs font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-text-main hover:text-primary transition-all"
                >
                  View Catalog <ArrowRight size={14} className="group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-6 sm:bottom-12 right-6 sm:right-12 flex items-center gap-2 sm:gap-3">
            {featuredArtists.map((_, index) => (
              <div 
                key={index}
                className={`transition-all duration-700 rounded-full ${
                  index === currentSlide ? 'bg-primary w-6 sm:w-8 h-1' : 'bg-slate-300 dark:bg-white/10 w-2 h-1'
                }`} 
              />
            ))}
          </div>
        </section>
      )}

      {/* CURATION INDEX */}
      <section className="space-y-8 sm:space-y-10">
        <div className="flex items-center justify-between px-1 sm:px-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <Layers size={16} className="text-primary" />
            <h2 className="text-[9px] sm:text-xs font-black text-text-muted uppercase tracking-[0.2em] sm:tracking-[0.3em]">Curation Index</h2>
          </div>
          <button 
            onClick={() => navigate('/library')}
            className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary flex items-center gap-1 sm:gap-2"
          >
            Archive <ChevronRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {playlists.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/playlist/${item.id}`)}
              className="group cursor-pointer space-y-2 sm:space-y-4"
            >
              <div className="aspect-square rounded-xl sm:rounded-2xl relative overflow-hidden bg-surface border border-slate-100 dark:border-white/5 shadow-sm">
                {item.cover_image?.url || item.cover_image_path ? (
                  <img 
                    src={item.cover_image?.url || item.cover_image_path} 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                    alt="" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted/10">
                    <Music size={32} className="sm:text-4xl" />
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <div className="w-12 sm:w-14 h-12 sm:h-14 bg-white text-primary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                    <Play size={20} className="sm:text-2xl" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="px-1 sm:px-0">
                <h3 className="text-xs sm:text-sm font-bold text-text-main uppercase tracking-tight truncate group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-[8px] sm:text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">{item.song_ids?.length || 0} Records</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RECENT SONGS */}
      <section className="space-y-6 sm:space-y-10">
        <div className="flex items-center gap-2 sm:gap-3 px-1 sm:px-2">
          <Activity size={16} className="text-slate-400" />
          <h2 className="text-[9px] sm:text-xs font-black text-text-muted uppercase tracking-[0.2em] sm:tracking-[0.3em]">Recent Reception</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-6 sm:gap-y-4">
          {recentSongs.map((item, index) => {
            const isCurrent = currentTrack?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => playPlaylist(recentSongs, index)}
                className={`group flex items-center gap-3 sm:gap-5 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all cursor-pointer border ${
                  isCurrent 
                    ? "bg-surface border-primary/20 shadow-sm" 
                    : "border-transparent hover:bg-surface hover:border-slate-100 dark:hover:border-white/5"
                }`}
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden bg-slate-50 dark:bg-white/5 shrink-0 border border-slate-200 dark:border-white/10 relative">
                  <img src={item.images?.[1]?.url || item.album?.images?.[1]?.url} className="w-full h-full object-cover" alt="" />
                  {isCurrent && isPlaying && (
                    <div className="absolute inset-0 bg-primary/30 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="w-1 h-2 sm:h-3 bg-white mx-[0.5px] animate-bounce" />
                      <div className="w-1 h-3 sm:h-4 bg-white mx-[0.5px] animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1.5 sm:h-2 bg-white mx-[0.5px] animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm sm:text-base font-bold truncate ${isCurrent ? 'text-primary' : 'text-text-main'}`}>
                    {item.title}
                  </h3>
                  <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-text-muted truncate opacity-80">
                    {item.artists?.map(a => a.name).join(', ')}
                  </p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                  <Play size={14} className="text-primary sm:text-[16px]" fill="currentColor" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default MainContent;
