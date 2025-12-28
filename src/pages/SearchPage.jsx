import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const mockResults = query.length > 0 ? [
    { id: 1, type: 'Playlist', name: 'Your Tech', color: 'from-blue-500 to-purple-500' },
    { id: 2, type: 'Artist', name: 'Solange', color: 'from-purple-500 to-pink-500' },
    { id: 3, type: 'Album', name: 'Earthon Collection', color: 'from-green-500 to-teal-500' },
    { id: 4, type: 'Track', name: 'Track In Semn', color: 'from-orange-500 to-red-500' },
  ] : [];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="p-8 space-y-8">
        {/* Search Header */}
        <div>
          <h1 className="text-4xl font-bold mb-6">Search</h1>
          
          {/* Search Input */}
          <div className="relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              className="w-full bg-white/10 border border-white/20 rounded-full pl-12 pr-12 py-4 text-white placeholder-white/50 focus:outline-none focus:border-purple-electric focus:shadow-glow-purple transition-all"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {query.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Results for "{query}"</h2>
            <div className="grid grid-cols-4 gap-4">
              {mockResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.type === 'Playlist') {
                      navigate(`/playlist/${item.name.toLowerCase().replace(/\s+/g, '-')}`);
                    }
                  }}
                  className="glass rounded-xl p-4 hover:glass-strong transition-all duration-300 cursor-pointer group"
                >
                  <div className={`aspect-square rounded-lg bg-gradient-to-br ${item.color} mb-3`} />
                  <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                  <p className="text-sm text-white/60">{item.type}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <SearchIcon size={64} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/50">Start typing to search for music</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
