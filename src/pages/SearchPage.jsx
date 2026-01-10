import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks'; 
import { Search as SearchIcon, X, Play, Mic2, Disc, ListMusic } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { db } from '../data/db';
import { formatDuration } from '../data/utils';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { playTrack } = usePlayer();

  // --- REAL-TIME DATABASE SEARCH ---
  const results = useLiveQuery(async () => {
    if (!query.trim()) return null;

    const q = query.toLowerCase();

    // 1. Run parallel queries
    const [artists, albums, playlists, rawSongs] = await Promise.all([
      db.artists.filter(a => a.name.toLowerCase().includes(q)).limit(4).toArray(),
      db.albums.where("type").anyOf("album").filter(a => a.title.toLowerCase().includes(q)).limit(4).toArray(),
      db.playlists.filter(p => p.title.toLowerCase().includes(q)).limit(4).toArray(),
      db.songs.filter(s => s.title.toLowerCase().includes(q)).limit(5).toArray(),
    ]);

    // 2. Hydrate Songs with Images
    const songs = await Promise.all(rawSongs.map(async (song) => {
      const album = await db.albums.get(song.album_id);
      return { ...song, album };
    }));

    return { artists, albums, playlists, songs };
  }, [query]);


  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-black">
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* --- SEARCH HEADER --- */}
        <div className="sticky top-0 bg-black/95 backdrop-blur-xl z-30 py-4 -mx-6 px-6 md:-mx-10 md:px-10">
          <div className="max-w-[360px] relative group">
            
            {/* Search Icon */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-white transition-colors duration-200 pointer-events-none">
                <SearchIcon size={18} />
            </div>

            {/* The Input Box (Smaller & Rectangular) */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              // Changed: rounded-full -> rounded-md (rectangular with slight round), py-3 -> py-2 (smaller height)
              className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] border border-transparent rounded-full pl-10 pr-10 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200"
              autoFocus
            />

            {/* Clear Button */}
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-neutral-400 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>


        {/* --- RESULTS AREA --- */}
        {results ? (
          <div className="space-y-12 animate-fade-in pb-20">
            
            {/* 1. SONGS RESULTS */}
            {results.songs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
                <div className="flex flex-col">
                  {results.songs.map((song) => {
                     const img = song.images?.[2]?.url || song.album?.images?.[2]?.url || song.album?.images?.[0]?.url || '/default-track.png';
                    
                    return (
                      <div
                      key={song.id}
                      onClick={async () => {
                          const artists = await db.artists.bulkGet(song.artist_ids)
                          playTrack({...song, artists})
                        }}
                        className="group flex items-center gap-4 p-2 pr-4 rounded hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded overflow-hidden bg-white/5 relative flex-shrink-0">
                          <img src={img} alt={song.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Play size={14} fill="white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate text-base">{song.title}</h4>
                          <p className="text-sm text-neutral-400 truncate group-hover:text-white transition-colors">
                            {song.album?.title || 'Single'}
                          </p>
                        </div>
                        <span className="text-sm text-neutral-400 font-mono">
                          {formatDuration(song.duration)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 2. ARTISTS RESULTS */}
            {results.artists.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Artists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {results.artists.map(artist => (
                    <div 
                      key={artist.id}
                      onClick={() => navigate(`/artist/${artist.id}`)}
                      className="group flex flex-col items-center gap-3 cursor-pointer p-4 rounded-xl transition-all"
                    >
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg bg-neutral-800">
                        {artist.images?.[0]?.url ? (
                          <img src={artist.images[0].url} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20"><Mic2 size={40}/></div>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-base text-center truncate w-full">{artist.name}</h3>
                      <p className="text-sm text-neutral-400">Artist</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. ALBUMS & PLAYLISTS */}
            {(results.albums.length > 0 || results.playlists.length > 0) && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Albums</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {results.albums.map(album => (
                    <div
                      key={`album-${album.id}`}
                      onClick={() => navigate(`/playlist/${album.id}`)}
                      className="group bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer"
                    >
                      <div className="aspect-square rounded shadow-lg mb-4 overflow-hidden relative bg-neutral-800">
                        {album.images?.[0]?.url ? (
                          <img src={album.images[0].url} alt={album.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Disc className="text-white/20"/></div>
                        )}
                      </div>
                      <h3 className="font-bold text-white truncate text-base mb-1">{album.title}</h3>
                      <p className="text-sm text-neutral-400">Album</p>
                    </div>
                  ))}

                  {results.playlists.map(playlist => (
                    <div
                      key={`playlist-${playlist.id}`}
                      onClick={() => navigate(`/playlist/${playlist.id}`)}
                      className="group bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer"
                    >
                      <div className="aspect-square rounded shadow-lg mb-4 overflow-hidden relative bg-neutral-800">
                         {playlist.cover_image?.url || playlist.cover_image_path ? (
                            <img src={playlist.cover_image?.url || playlist.cover_image_path} alt={playlist.title} className="w-full h-full object-cover" />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center"><ListMusic className="text-white/20"/></div>
                         )}
                      </div>
                      <h3 className="font-bold text-white truncate text-base mb-1">{playlist.title}</h3>
                      <p className="text-sm text-neutral-400">Playlist</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* NO RESULTS */}
            {results.songs.length === 0 && results.artists.length === 0 && results.albums.length === 0 && results.playlists.length === 0 && (
               <div className="text-center py-20">
                 <h3 className="text-xl font-bold text-white">No results found for "{query}"</h3>
                 <p className="text-neutral-400 mt-2">Please make sure your words are spelled correctly, or use less or different keywords.</p>
               </div>
            )}
 
          </div>
        ) : (
          // --- EMPTY STATE (Idle) ---
          <div className="flex flex-col items-center justify-center py-32">
            <h2 className="text-xl font-bold text-white mb-2">Play what you love</h2>
            <p className="text-sm text-neutral-400">Search for artists, songs, albums, and more.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;