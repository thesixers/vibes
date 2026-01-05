import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Music, Disc, Heart, ChevronRight, Plus, ListMusic } from "lucide-react";
import { db } from "../data/db";

const LibraryPage = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songCount, setSongCount] = useState(0);

  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = async () => {
    const ab = await db.albums.toArray();
    const pl = await db.playlists.toArray();
    const sCount = await db.songs.count(); // Just get the count for the box
    
    // Filter out singles for albums view
    const fullAlbums = ab.filter(a => a.total_tracks > 1);
    
    setAlbums(fullAlbums);
    setPlaylists(pl);
    setSongCount(sCount);
  };

  return (
    // pb-32 adds space for the bottom player
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-black to-purple-900/10 pb-32">
      <div className="p-6 md:p-10 space-y-10">
        
        {/* --- Header --- */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40 mb-2">
              Your Library
            </h2>
            <p className="text-white/50 text-sm md:text-base">
              {playlists.length} playlists • {albums.length} albums
            </p>
          </div>
        </div>

        {/* --- SECTION 1: QUICK COLLECTIONS (New!) --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 2. ALL SONGS BOX */}
            <div 
                onClick={() => navigate('/playlist/all')}
                className="group relative h-32 md:h-40 bg-gradient-to-br from-blue-900 to-blue-600 rounded-xl p-6 flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform shadow-lg shadow-blue-900/20 overflow-hidden"
            >
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-1">All Songs</h3>
                    <p className="text-blue-200 font-medium">{songCount} tracks</p>
                </div>
                <div className="relative z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-xl group-hover:scale-110 transition-transform">
                    <ListMusic size={24} />
                </div>
                {/* Decorative Icon Background */}
                <ListMusic size={140} className="absolute -bottom-4 -right-4 text-white/10 rotate-12" />
            </div>
        </section>

        {/* --- SECTION 2: PLAYLISTS --- */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Music size={20} className="text-purple-electric" />
            <h3 className="text-xl font-bold text-white">Playlists</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            
            {/* ✅ RESTORED: Create New Playlist Box */}
            <div 
                onClick={() => console.log("Create Playlist Logic Here")}
                className="group border-2 border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all aspect-square"
            >
                <div className="w-14 h-14 rounded-full bg-white/5 group-hover:bg-purple-electric group-hover:text-white flex items-center justify-center transition-colors text-white/50">
                    <Plus size={28} />
                </div>
                <span className="text-sm font-bold text-white/50 group-hover:text-white transition-colors">Create Playlist</span>
            </div>

            {/* Existing Playlists */}
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className="group relative bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer flex flex-col gap-4 shadow-lg hover:shadow-glow-purple/20"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-black/50 shadow-lg">
                  {playlist.cover_image?.url || playlist.cover_image_path ? (
                    <img 
                      src={playlist.cover_image?.url || playlist.cover_image_path} 
                      alt={playlist.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-800 to-black flex items-center justify-center">
                      <Music size={40} className="text-white/20" />
                    </div>
                  )}
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-purple-electric rounded-full flex items-center justify-center shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Play size={20} fill="white" className="ml-1 text-white" />
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-white text-lg truncate group-hover:text-purple-electric transition-colors">
                    {playlist.title}
                  </h3>
                  <p className="text-sm text-white/50 truncate mt-1">
                    {playlist.songs?.length || 0} tracks
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 3: ALBUMS --- */}
        <section>
          <div className="flex items-center gap-2 mb-6 mt-12">
            <Disc size={20} className="text-blue-400" />
            <h3 className="text-xl font-bold text-white">Albums</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {albums.map((album) => (
              <div
                key={album.id}
                onClick={() => navigate(`/playlist/${album.id}`)}
                className="group relative flex items-center gap-4 p-3 pr-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-lg group-hover:shadow-glow-purple/30 transition-shadow">
                  <img
                    src={album.images?.[1]?.url || album.images?.[0]?.url || "/default_cover.png"}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-base truncate mb-1 pr-2 group-hover:text-blue-400 transition-colors">
                    {album.title}
                  </h3>
                  <div className="flex items-center text-xs text-white/50 gap-2">
                     <span className="truncate">{new Date(album.release_date).getFullYear()}</span>
                     <span className="w-1 h-1 rounded-full bg-white/30"></span>
                     <span>{album.total_tracks} tracks</span>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                   <ChevronRight size={20} className="text-white/40" />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default LibraryPage;