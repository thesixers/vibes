import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPlaylists } from '../data/mockData';

const LibraryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="p-8 space-y-8">
        <h1 className="text-4xl font-bold">Your Library</h1>

        <div className="grid grid-cols-3 gap-4">
          {mockPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => navigate(`/playlist/${playlist.id}`)}
              className="glass rounded-xl p-6 hover:glass-strong transition-all duration-300 cursor-pointer group flex items-center gap-4"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden shadow-glow-purple">
                <img src={playlist.cover_image_path} alt={playlist.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-lg mb-1">{playlist.title}</h3>
                <p className="text-sm text-white/60">{playlist.songs.length} tracks</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
