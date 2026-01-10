import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Player from './components/Player';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import PlaylistPage from './pages/PlaylistPage';
import { SyncProvider } from './context/SyncContext';

import { PlayerProvider } from './context/PlayerContext';
import AccountPage from './pages/AccountPage';
import SyncUI from './components/SyncUI';
import ArtistPage from './pages/ArtistPage';
import PlaylistForm from './components/PlaylistForm';

function App() {
  return (
    <SyncProvider>
      <PlayerProvider>
      <HashRouter>
        <div className="w-full h-full flex flex-col bg-void">
          {/* Custom Title Bar */}
          <TitleBar />

          {/* Main Layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* sync ui */}
            <SyncUI />
            <PlaylistForm />
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area with Routes */}
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/playlist/:id" element={<PlaylistPage />} />
              <Route path="/artist/:id" element={<ArtistPage />} />
            </Routes>
          </div>

          {/* Bottom Player */}
          <Player />
        </div>
      </HashRouter>
    </PlayerProvider>
    </SyncProvider>
  );
}

export default App;
