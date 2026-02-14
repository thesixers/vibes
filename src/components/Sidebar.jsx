import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Library,
  Disc,
  ChevronLeft,
  ChevronRight,
  ListMusic,
  Plus,
  Trash2,
  X,
  Check,
  RotateCcw,
  Zap,
} from "lucide-react";
import { db } from "../data/db";
import { useSync } from "../context/SyncContext";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [playlistDeleteID, setPlaylistDeleteID] = useState(null);
  const { handleSync, isSyncing } = useSync();

  const userPlaylists = useLiveQuery(() => db.playlists.toArray()) || [];

  const navItems = [
    { icon: Home, label: "Home", path: "/", color: "text-blue-400" },
    { icon: Search, label: "Search", path: "/search", color: "text-emerald-400" },
    { icon: Library, label: "Library", path: "/library", color: "text-purple-400" },
  ];

  const sidebarVariants = {
    expanded: { width: "260px" },
    collapsed: { width: "80px" },
  };

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      className="h-full bg-surface border-r border-slate-100 dark:border-white/5 flex flex-col relative z-50 overflow-hidden"
    >
      {/* 1. BRAND HEADER - RESTORED VIBES */}
      <div className={`flex items-center p-6 mb-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white shadow-soft">
              <Zap size={20} fill="currentColor" strokeWidth={0} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-text-main leading-none">Vibes</span>
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest mt-1 opacity-80">Powered by GX</span>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl border border-slate-100 dark:border-white/5 text-text-muted hover:text-primary transition-all shadow-sm"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* 2. MAIN NAVIGATION - RESTORED ICON COLORS */}
      <nav className="px-4 space-y-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? "bg-primary text-white shadow-soft font-bold"
                  : "text-text-muted hover:bg-slate-50 dark:hover:bg-white/5 hover:text-text-main border border-transparent hover:border-slate-100 dark:hover:border-white/10"
              } ${isCollapsed ? "justify-center px-0" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`shrink-0 transition-colors ${isActive ? "text-white" : item.color}`} 
                />
                {!isCollapsed && (
                  <span className="text-sm font-bold tracking-tight">
                    {item.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        <button
          onClick={handleSync}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-text-muted hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
        >
          <motion.div
            animate={isSyncing ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="text-orange-400"
          >
            <RotateCcw size={22} />
          </motion.div>
          {!isCollapsed && <span className="text-sm font-bold">Sync Library</span>}
        </button>
      </nav>

      {/* 3. DATA STREAMS - RESTORED COLORFUL ACCENTS */}
      <div className="px-4 pb-6 flex flex-col overflow-hidden min-h-0">
        {!isCollapsed && (
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Data Streams</h3>
            <button onClick={() => navigate("/library")} className="text-text-muted hover:text-primary transition-colors">
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
          <button
            onClick={() => navigate("/playlist/all")}
            className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0 border border-blue-200/50">
              <Disc size={16} />
            </div>
            {!isCollapsed && <span className="text-sm font-bold text-text-main truncate">My Songs</span>}
          </button>

          {userPlaylists.map((playlist) => (
            <div key={playlist.id} className="relative group/item">
              <button
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-primary flex items-center justify-center shrink-0 overflow-hidden border border-orange-200/50">
                   {playlist.cover_image?.url ? (
                     <img src={playlist.cover_image.url} className="w-full h-full object-cover" alt="" />
                   ) : (
                     <ListMusic size={16} />
                   )}
                </div>
                {!isCollapsed && (
                  <span className="text-sm font-bold text-text-muted group-hover/item:text-text-main truncate flex-1 text-left">
                    {playlist.title}
                  </span>
                )}
              </button>
              
              {!isCollapsed && (
                <button
                  onClick={(e) => { e.stopPropagation(); setPlaylistDeleteID(playlist.id); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 p-1.5 text-text-muted hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. FOOTER */}
      <div className="p-2 border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <ThemeToggle />
          {!isCollapsed && (
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-none">Node 0xGX</span>
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {playlistDeleteID && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-24 left-4 right-4 bg-text-main text-bgMain p-4 rounded-2xl shadow-xl z-50 flex flex-col gap-3 border border-white/10"
          >
            <span className="text-xs font-black uppercase tracking-widest text-center">Delete Stream?</span>
            <div className="flex gap-2">
              <button
                onClick={() => { db.playlists.delete(playlistDeleteID); setPlaylistDeleteID(null); }}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition shadow-sm"
              >
                Confirm
              </button>
              <button
                onClick={() => setPlaylistDeleteID(null)}
                className="flex-1 py-2 rounded-xl bg-bgMain text-text-main font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition border border-slate-200"
              >
                Abort
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Sidebar;