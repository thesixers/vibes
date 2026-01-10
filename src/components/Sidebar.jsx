import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Home,
  Search,
  Library,
  Music,
  ChevronLeft,
  Menu,
  ListMusic,
  Plus,
  Trash2,
  X,
  Check,
  User,
  RotateCcwIcon
} from "lucide-react";
import { db } from "../data/db";
import { useSync } from "../context/SyncContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [playlistDeleteID, setPlaylistDeleteID] = useState(null);
  const { handleSync } = useSync();

  // Fetch User Playlists from DB
  const userPlaylists = useLiveQuery(() => db.playlists.toArray()) || [];

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Library, label: "Library", path: "/library" },
    // { icon: User, label: "Account", path: "/account" },
  ];

  // Modified Special Playlists (Removed Liked Songs)
  const specialPlaylists = [
    { name: "All Songs", icon: Music, id: "all", color: "text-blue-400" },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-60"
      } h-full glass border-r border-white/5 flex flex-col transition-all duration-300 ease-in-out relative z-40`}
    >
      {/* Toggle Button */}
      <div
        className={`p-4 flex ${isCollapsed ? "justify-center" : "justify-end"}`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-2">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            title={isCollapsed ? item.label : ""}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed ? "justify-center px-2" : "gap-3 px-4"
              } py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? "bg-purple-electric shadow-glow-purple text-white"
                  : "hover:bg-white/5 text-white/70 hover:text-white"
              }`
            }
          >
            <div className="relative">
              <item.icon size={20} />
            </div>

            <span
              className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
        <div
            className={`flex items-center ${
                isCollapsed ? "justify-center px-2" : "gap-3 px-4"
              } py-3 rounded-xl transition-all duration-300 group hover:bg-white/5 text-white/70 hover:text-white cursor-pointer`
            }

            onClick={handleSync}
          >
            <div className="relative">
              <RotateCcwIcon size={20} />
            </div>

            <span
              className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              Sync Songs
            </span>
          </div>
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/10 my-4" />

      {/* Playlists Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4 space-y-1">
        {/* Header */}
        <div
          className={`flex items-center justify-between px-2 mb-2 transition-opacity duration-300 ${
            isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
          }`}
        >
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
            Playlists
          </h3>
          <button
            onClick={() => navigate("/library")} // Or trigger create modal
            className="text-white/50 hover:text-white transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* 1. Special Playlists (Just All Songs) */}
        {specialPlaylists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => navigate(`/playlist/${playlist.id}`)}
            title={isCollapsed ? playlist.name : ""}
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center px-2" : "gap-3 px-3"
            } py-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors group`}
          >
            <playlist.icon
              size={18}
              className={`flex-shrink-0 ${playlist.color || ""}`}
            />

            <span
              className={`text-sm truncate transition-all duration-300 text-left ${
                isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              {playlist.name}
            </span>
          </button>
        ))}

        {/* 2. User Playlists (From DB) */}
        {userPlaylists.map((playlist) => (
          <div className="flex justify-center items-center" key={playlist.id}>
            <button
              onClick={() => navigate(`/playlist/${playlist.id}`)}
              title={isCollapsed ? playlist.title : ""}
              className={`w-full flex items-center relative ${
                isCollapsed ? "justify-center px-2" : "gap-3 px-3"
              } py-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors group`}
            >
              <div className="flex-shrink-0">
                {playlist.cover_image?.url && !isCollapsed ? (
                  <img
                    src={playlist.cover_image.url}
                    alt=""
                    className="w-5 h-5 rounded object-cover"
                  />
                ) : (
                  <ListMusic size={18} />
                )}
              </div>

              <span
                className={`text-sm truncate transition-all duration-300 text-left ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                {playlist.title}
              </span>
            </button>
            {!isCollapsed && (
              <button
                className="w-[30px] h-[30px] z-[50px]"
                onClick={() => {
                  setPlaylistDeleteID(playlist.id);
                }}
              >
                <Trash2 className="w-full h-[15px]" />
              </button>
            )}
            {playlistDeleteID === playlist.id && (
              <div className="absolute w-full px-2 py-2 rounded-2xl overflow-hidden bg-gray-900 flex justify-between items-center shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 z-50">
                <span className="text-[13px] text-center flex-1 font-mono">
                  Are you sure ?
                </span>
                <div className="flex justify-center items-center gap-1">
                  <button
                    onClick={async () => {
                      await db.playlists.delete(playlist.id);
                    }}
                    className="rounded-full w-[25px] h-[25px] flex items-center justify-center hover:bg-gray-200/10"
                  >
                    <Check className="text-green-400 w-[15px] h-[15px]" />
                  </button>
                  <button
                    onClick={() => {
                      setPlaylistDeleteID(null);
                    }}
                    className="rounded-full w-[25px] h-[25px] flex items-center justify-center hover:bg-gray-200/10 "
                  >
                    <X className="text-red-400 w-[15px] h-[15px]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
