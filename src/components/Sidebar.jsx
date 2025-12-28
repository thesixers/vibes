import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Library, Music, Heart, Clock, User } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Library', path: '/library' },
    { icon: User, label: 'Account', path: '/account' },
  ];

  const playlists = [
    { name: 'Your Tech', icon: Music, id: 'your-tech' },
    { name: 'Earthon', icon: Music, id: 'earthon' },
    { name: 'Solange', icon: Music, id: 'solange' },
    { name: 'Protomative', icon: Music, id: 'protomative' },
    { name: 'Liked Songs', icon: Heart, id: 'liked' },
    { name: 'Recently Played', icon: Clock, id: 'recent' },
  ];

  return (
    <div className="w-60 h-full glass border-r border-white/5 flex flex-col">
      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-purple-electric shadow-glow-purple text-white'
                  : 'hover:bg-white/5 text-white/70 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/10 my-2" />

      {/* Playlists */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">
        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 px-2">
          Playlists
        </h3>
        <div className="space-y-1">
          {playlists.map((playlist) => (
            <button
              key={playlist.name}
              onClick={() => navigate(`/playlist/${playlist.id}`)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors"
            >
              <playlist.icon size={16} />
              <span className="text-sm truncate">{playlist.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

