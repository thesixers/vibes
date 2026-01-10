import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks'; 
import { ChevronRight, Play, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { db } from '../data/db'; 

const MainContent = () => {
  const navigate = useNavigate();
  const { playPlaylist, currentTrack, togglePlay } = usePlayer();
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- FETCH DATA ---
  const data = useLiveQuery(async () => {
    // A. Fetch recent songs (New Waves)
    const songs = await db.songs.limit(10).toArray(); 
    const recentSongs = songs.reverse().slice(0, 6);

    // B. Fetch Playlists (Vibe Curation)
    const playlists = await db.playlists.limit(4).toArray();

    // C. Fetch Featured Artists (Hero Carousel)
    const allArtists = await db.artists.limit(5).toArray();
    const featuredArtists = allArtists.length > 0 ? allArtists : [];

    // Hydrate songs with artist/album info
    const hydratedSongs = await Promise.all(recentSongs.map(async (s) => {
      const artists = await db.artists.where('id').anyOf(s.artist_ids).toArray();
      const album = await db.albums.get(s.album_id);
      return { ...s, artists, album };
    }));

    return {
      recentSongs: hydratedSongs,
      playlists,
      featuredArtists
    };
  });

  // Carousel Timer
  useEffect(() => {
    if (!data?.featuredArtists.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.featuredArtists.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [data?.featuredArtists.length]);

  if (!data) return <div className="p-8 text-white/50">Loading vibes...</div>;

  const { recentSongs, playlists, featuredArtists } = data;
  const currentArtist = featuredArtists[currentSlide];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-black to-purple-900/10">
      <div className="p-6 md:p-8 space-y-10">
        
        {/* --- HERO: FEATURED ARTIST CAROUSEL --- */}
        {currentArtist ? (
          <div 
            // ✅ LINK TO ARTIST PAGE
            onClick={() => navigate(`/artist/${currentArtist.id}`)} 
            className="relative h-64 md:h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-2xl shadow-purple-900/20"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
               {currentArtist.images?.[0]?.url ? (
                 <img 
                   src={currentArtist.images[0].url} 
                   alt={currentArtist.name} 
                   className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                 />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-black" />
               )}
            </div>
            
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-8 md:p-10">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-white uppercase bg-white/10 backdrop-blur-md rounded-full w-fit border border-white/10">
                Featured Artist
              </span>
              <h1 className="text-5xl md:text-7xl font-vibes font-bold mb-4 text-white tight-leading drop-shadow-lg">
                {currentArtist.name}
              </h1>
              
              <div className="flex gap-3">
                {/* Play Button (Stop Propagation prevents navigating to page) */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Optional: Play this artist's top songs immediately
                    navigate(`/artist/${currentArtist.id}`);
                  }}
                  className="bg-purple-electric hover:bg-purple-500 text-white px-6 py-3 rounded-full font-bold transition-all shadow-glow-purple flex items-center gap-2"
                >
                  <Play size={18} fill="currentColor" /> Play Now
                </button>
                
                {/* View Profile Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/artist/${currentArtist.id}`);
                  }}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold transition-all border border-white/10"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-8 right-8 flex gap-2">
              {featuredArtists.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/30 w-2'
                  }`} 
                />
              ))}
            </div>
          </div>
        ) : (
          // Empty State
          <div className="h-64 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <p className="text-white/40">Add artists to your library to see them here</p>
          </div>
        )}

        {/* --- SECTION 1: VIBE CURATION (PLAYLISTS) --- */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white font-vibes">Your Vibes</h2>
            <button 
              onClick={() => navigate('/library')}
              className="text-sm text-purple-electric hover:text-white transition-colors font-medium flex items-center gap-1"
            >
              See All <ChevronRight size={16} />
            </button>
          </div>

          {playlists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {playlists.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/playlist/${item.id}`)}
                  className="group bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col gap-3"
                >
                  <div className="aspect-square rounded-lg relative overflow-hidden shadow-lg">
                    {item.cover_image?.url || item.cover_image_path ? (
                      <img src={item.cover_image?.url || item.cover_image_path} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                        <Music className="text-white/20" size={32} />
                      </div>
                    )}
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/playlist/${item.id}`); 
                        }}
                        className="w-12 h-12 rounded-full bg-purple-electric text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                      >
                        <Play size={20} fill="currentColor" className="ml-1" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white truncate">{item.title}</h3>
                    <p className="text-sm text-white/50">{item.song_ids?.length || 0} tracks</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/30 text-sm italic">No playlists created yet.</div>
          )}
        </div>

        {/* --- SECTION 2: NEW WAVES (RECENT SONGS) --- */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white font-vibes">New Waves</h2>
          </div>

          {recentSongs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recentSongs.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (
                      currentTrack &&
                      currentTrack.id === item.id
                    )
                      return togglePlay();

                      playPlaylist(recentSongs, index);
                  }}
                  className="group bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer"
                >
                  <div className="aspect-square rounded-lg mb-3 relative overflow-hidden shadow-md">
                    {/* Image Priority: Song > Album > Artist > Default */}
                    {item.images?.[1]?.url || item.album?.images?.[1]?.url || item.artists?.[0]?.images?.[1]?.url ? (
                      <img 
                        src={item.images?.[1]?.url || item.album?.images?.[1]?.url || item.artists?.[0]?.images?.[1]?.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                       <div className="w-full h-full bg-gradient-to-br from-purple-electric/20 to-purple-glow/20 flex items-center justify-center">
                         <Music size={24} className="text-white/30" />
                       </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                        <Play size={16} fill="currentColor" className="ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-white text-sm mb-1 truncate">{item.title}</h3>
                  <p className="text-xs text-white/50 truncate">
                    {item.artists?.map(a => a.name).join(', ') || 'Unknown'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-white/40 gap-2">
              <Music size={32} />
              <p>Your library is empty.</p>
              <button onClick={() => navigate('/search')} className="text-purple-electric hover:underline">
                Go to Search
              </button>
            </div>
          )}
        </div>

        
        <div className='h-[100px]'/>
      </div>
    </div>
  );
};

export default MainContent;