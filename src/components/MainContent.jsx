import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { mockPlaylists, mockSongs } from '../data/mockData';

const MainContent = () => {
  const navigate = useNavigate();
  const { playTrack, playPlaylist } = usePlayer();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const featuredArtists = [
    {
      name: 'Solange',
      subtitle: 'Home',
      color: 'from-purple-electric/40 via-purple-glow/30',
      id: 'solange'
    },
    {
      name: 'Burna Boy',
      subtitle: 'Featured Artist',
      color: 'from-orange-500/40 via-red-500/30',
      id: 'burna-boy'
    },
    {
      name: 'Earthon',
      subtitle: 'Vibe Curator',
      color: 'from-green-500/40 via-teal-500/30',
      id: 'earthon'
    },
    {
      name: 'Protomative',
      subtitle: 'Electronic Pioneer',
      color: 'from-blue-500/40 via-indigo-500/30',
      id: 'protomative'
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredArtists.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const vibeCuration = mockPlaylists.slice(0, 4);
  const newWaves = mockSongs.slice(0, 6);

  const currentArtist = featuredArtists[currentSlide];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="p-8 space-y-8">
        {/* Featured Artist Carousel */}
        <div className="relative h-64 rounded-2xl overflow-hidden glass-strong group cursor-pointer transition-all duration-700">
          <div className={`absolute inset-0 bg-gradient-to-br ${currentArtist.color} to-transparent transition-all duration-1000`} />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
          
          <div className="relative h-full flex flex-col justify-end p-8">
            <p className="text-sm text-white/70 mb-2 transition-all duration-500 transform translate-y-0 opacity-100">
              {currentArtist.subtitle}
            </p>
            <h1 className="text-6xl font-bold mb-4 text-shadow-glow transition-all duration-500 transform translate-y-0 opacity-100">
              {currentArtist.name}
            </h1>
            <button className="btn-glow w-fit">
              Learn More
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 right-8 flex gap-2">
            {featuredArtists.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white w-6' : 'bg-white/30'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Vibe Curation */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Vibe Curation</h2>
            <button 
              onClick={() => navigate('/library')}
              className="text-sm text-purple-electric hover:text-purple-glow flex items-center gap-1 transition-colors"
            >
              See All
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {vibeCuration.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/playlist/${item.id}`)}
                className="glass rounded-xl p-4 hover:glass-strong transition-all duration-300 cursor-pointer group"
              >
                <div className="aspect-square rounded-lg mb-3 relative overflow-hidden shadow-lg">
                  <img src={item.cover_image_path} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.songs.length > 0) playPlaylist(item.songs, 0);
                      }}
                      className="w-12 h-12 rounded-full bg-purple-electric flex items-center justify-center shadow-glow-purple hover:scale-110 transition-transform"
                    >
                      <Play size={20} className="text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-1 truncate">{item.title}</h3>
                <p className="text-sm text-white/60">Playlist</p>
              </div>
            ))}
          </div>
        </div>

        {/* New Waves */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">New Waves</h2>
            <button 
              onClick={() => navigate('/library')}
              className="text-sm text-purple-electric hover:text-purple-glow flex items-center gap-1 transition-colors"
            >
              See All
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-6 gap-4">
            {newWaves.map((item, index) => (
              <div
                key={index}
                onClick={() => playPlaylist(newWaves, index)}
                className="glass rounded-xl p-3 hover:glass-strong transition-all duration-300 cursor-pointer group"
              >
                <div className="aspect-square rounded-lg mb-3 relative overflow-hidden shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-electric/20 to-purple-glow/20" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-10 h-10 rounded-full bg-purple-electric flex items-center justify-center shadow-glow-purple">
                      <Play size={16} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-white text-sm mb-0.5 truncate">{item.title}</h3>
                <p className="text-xs text-white/60 truncate">{item.artists.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;

