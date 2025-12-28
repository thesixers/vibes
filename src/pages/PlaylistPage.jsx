import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Heart, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { mockPlaylists, mockAlbums } from '../data/mockData';

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playPlaylist, currentTrack, isPlaying, togglePlay } = usePlayer();

  const playlist = mockPlaylists.find(p => p.id === id) || mockPlaylists[0];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="p-8 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        {/* Playlist Header */}
        <div className="flex items-end gap-6">
          <div className="w-48 h-48 rounded-xl overflow-hidden shadow-glow-purple">
            <img src={playlist.cover_image_path} alt={playlist.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm text-white/60 mb-2">PLAYLIST</p>
            <h1 className="text-6xl font-bold mb-4">{playlist.title}</h1>
            <p className="text-white/70">{playlist.description}</p>
            <p className="text-xs text-white/40 mt-2">By {playlist.owner_name} • {playlist.songs.length} tracks</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (playlist.songs.length > 0) playPlaylist(playlist.songs, 0);
            }}
            className="w-14 h-14 rounded-full bg-purple-electric flex items-center justify-center hover:scale-105 transition-transform shadow-glow-purple"
          >
            <Play size={24} className="text-white ml-1" fill="white" />
          </button>
          <button className="w-12 h-12 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
            <Heart size={24} className="text-white/70" />
          </button>
          <button className="w-12 h-12 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
            <MoreHorizontal size={24} className="text-white/70" />
          </button>
        </div>

        {/* Track List */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-white/10 text-sm text-white/50">
            <div className="w-8">#</div>
            <div>TITLE</div>
            <div>ALBUM</div>
            <div>DURATION</div>
          </div>

          {playlist.songs.map((track, index) => {
            const album = mockAlbums.find(a => a.id === track.album_id);
            const isCurrent = currentTrack?.id === track.id;

            return (
              <div
                key={track.id}
                onClick={() => playPlaylist(playlist.songs, index)}
                className={`grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-6 py-3 hover:bg-white/5 transition-colors cursor-pointer group ${isCurrent ? 'bg-white/10' : ''}`}
              >
                <div className="w-8 text-white/50 group-hover:text-white flex items-center">
                  {isCurrent && isPlaying ? (
                    <div className="flex gap-0.5 items-end h-3">
                      <div className="w-0.5 h-full bg-purple-electric animate-bounce" />
                      <div className="w-0.5 h-2/3 bg-purple-electric animate-bounce [animation-delay:0.2s]" />
                      <div className="w-0.5 h-full bg-purple-electric animate-bounce [animation-delay:0.4s]" />
                    </div>
                  ) : (
                    <>
                      <span className="group-hover:hidden">{index + 1}</span>
                      <Play size={16} className="hidden group-hover:block" fill="white" />
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-white/5 overflow-hidden">
                    <img src={album?.cover_image_path} alt={album?.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className={`font-medium ${isCurrent ? 'text-purple-electric' : 'text-white'}`}>{track.title}</div>
                    <div className="text-sm text-white/60">{track.artists.join(', ')}</div>
                  </div>
                </div>
                <div className="text-white/60 flex items-center">{album?.title}</div>
                <div className="text-white/60 flex items-center">
                  {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
