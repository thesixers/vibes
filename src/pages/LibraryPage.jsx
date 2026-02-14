import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Music,
  Disc,
  ChevronRight,
  Plus,
  ListMusic,
  Library as LibraryIcon,
} from "lucide-react";
import { db } from "../data/db";
import { useSync } from "../context/SyncContext";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";

const LibraryPage = () => {
  const navigate = useNavigate();
  const { setShowPlaylistForm } = useSync();

  const data = useLiveQuery(async () => {
    const ab = await db.albums.where("type").anyOf("album").toArray();
    const playlists = await db.playlists.toArray();
    const songCount = await db.songs.count();
    const albums = ab.filter((a) => a.total_tracks > 1);
    return { albums, playlists, songCount };
  }) || { albums: [], playlists: [], songCount: 0 };

  const { albums, playlists, songCount } = data;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-bgMain pb-32">
      <div className="p-6 md:p-12 space-y-16 max-w-7xl mx-auto">
        
        {/* --- REFINED HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-surface border border-slate-200 dark:border-white/10 text-primary shadow-sm">
                <LibraryIcon size={22} />
              </div>
              <h2 className="text-xs font-black text-text-muted uppercase tracking-[0.3em]">
                Media Archive
              </h2>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-text-main tracking-tighter uppercase leading-none">
              Library
            </h1>
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mt-4 flex items-center gap-3">
              <span className="text-primary">{playlists.length} Playlists</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>{albums.length} Albums</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>{songCount} Master Tracks</span>
            </p>
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPlaylistForm(true)}
            className="flex items-center gap-3 bg-text-main text-bgMain px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-primary hover:text-white transition-all self-start md:self-auto"
          >
            <Plus size={18} strokeWidth={3} />
            <span>Create Playlist</span>
          </motion.button>
        </header>

        {/* --- QUICK ACTIONS --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ y: -4, borderColor: "var(--primary)" }}
            onClick={() => navigate("/playlist/all")}
            className="group relative h-36 bg-surface border border-slate-200 dark:border-white/10 rounded-2xl p-8 flex items-center justify-between cursor-pointer shadow-sm transition-all"
          >
            <div className="relative z-10">
              <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-2">Primary Index</h3>
              <p className="text-3xl font-black text-text-main uppercase tracking-tighter">All Songs</p>
            </div>
            <div className="relative z-10 w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
              <ListMusic size={24} />
            </div>
          </motion.div>
        </section>

        {/* --- PLAYLISTS SECTION --- */}
        <section>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="h-4 w-1 bg-primary rounded-full" />
            <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Custom Compilations</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <AnimatePresence>
              {playlists.map((playlist, i) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                  whileHover={{ y: -6 }}
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                  className="group cursor-pointer space-y-4"
                >
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-surface border border-slate-200 dark:border-white/10 shadow-sm">
                    {playlist.cover_image?.url || playlist.cover_image_path ? (
                      <img
                        src={playlist.cover_image?.url || playlist.cover_image_path}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt=""
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted/20">
                        <Music size={40} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center shadow-xl">
                        <Play size={20} fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  <div className="px-1">
                    <h3 className="font-bold text-text-main text-[11px] uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                      {playlist.title}
                    </h3>
                    <p className="text-[9px] text-text-muted font-black uppercase tracking-[0.1em] mt-1">
                      {playlist.song_ids?.length || 0} Entries
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* --- ALBUMS SECTION --- */}
        <section>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="h-4 w-1 bg-slate-200 dark:bg-white/10 rounded-full" />
            <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Full Releases</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album, i) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0, transition: { delay: i * 0.03 } }}
                whileHover={{ x: 6, borderColor: "var(--primary)" }}
                onClick={() => navigate(`/playlist/${album.id}`)}
                className="group flex items-center gap-5 p-4 rounded-xl bg-surface border border-slate-200 dark:border-white/10 shadow-sm transition-all cursor-pointer"
              >
                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-slate-100 dark:border-white/5">
                  <img
                    src={album.images?.[1]?.url || album.images?.[0]?.url || "/default_cover.png"}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all"
                    alt=""
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-text-main text-xs uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                    {album.title}
                  </h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-1">
                    {new Date(album.release_date).getFullYear()} • {album.total_tracks} Tracks
                  </p>
                </div>
                <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-all mr-2" />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LibraryPage;