import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { SyncProvider } from './context/SyncContext';
import { PlayerProvider } from './context/PlayerContext';

// Components
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Player from './components/Player';
import SyncUI from './components/SyncUI';
import PlaylistForm from './components/PlaylistForm';

// Pages
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import PlaylistPage from './pages/PlaylistPage';
import AccountPage from './pages/AccountPage';
import ArtistPage from './pages/ArtistPage';

function App() {
  return (
    <SyncProvider>
      <PlayerProvider>
        <HashRouter>
          {/* ROOT CONTAINER 
            - 'bg-bgMain': Applies the Theme Background (Light/Dark Slate)
            - 'text-text-main': Applies Theme Text
          */}
          <div className="w-full h-full flex flex-col bg-bgMain text-text-main font-sans transition-colors duration-300 overflow-hidden relative">
            
            {/* 1. TOP: TitleBar (Kept minimal) */}
            <TitleBar />

            {/* 2. MIDDLE: Floating Workspace 
               - 'p-3 gap-3': Creates the "separated cards" look between Sidebar and Content
            */}
            <div className="flex-1 flex overflow-hidden p-3 pt-0 gap-3 relative z-10">
              
              {/* Overlays (Hidden by default, popped up when needed) */}
              <div className="absolute inset-0 pointer-events-none flex justify-center items-center z-[100]">
                <SyncUI />
                <PlaylistForm />
              </div>

              {/* The Sidebar (Left Column) */}
              <Sidebar />

              {/* The Main View (Right Column - The "Card") 
                 - Rounded corners
                 - Subtle border for glass effect
                 - 'bg-surface/60': Semi-transparent backing
              */}
              <div className="flex-1  bg-surface/60 dark:bg-surface/30 border border-white/20 dark:border-white/5 shadow-inner-light overflow-hidden flex flex-col relative transition-all duration-300 backdrop-blur-md">
                 
                 {/* Scrollable Route Container */}
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                    <Routes>
                      <Route path="/" element={<MainContent />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/library" element={<LibraryPage />} />
                      <Route path="/account" element={<AccountPage />} />
                      <Route path="/playlist/:id" element={<PlaylistPage />} />
                      <Route path="/artist/:id" element={<ArtistPage />} />
                    </Routes>
                 </div>
              </div>

            </div>

            {/* 3. BOTTOM: Player Area
               - 'px-4 pb-4': Adds padding so the player floats slightly off the bottom edge
               - We will style the Player component next to be a "Floating Glass Pill"
            */}
            <div className="w-full px-3 pb-3 z-50 shrink-0">
               <Player />
            </div>

          </div>
        </HashRouter>
      </PlayerProvider>
    </SyncProvider>
  );
}

export default App;