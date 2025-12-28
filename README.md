# Vibes Desktop Music Player

A beautiful cross-platform desktop music player built with Electron, React, and Tailwind CSS featuring a stunning "Liquid Glass" UI design.

![Vibes Desktop](https://img.shields.io/badge/Platform-Linux%20%7C%20Windows%20%7C%20macOS-blue)
![Electron](https://img.shields.io/badge/Electron-28.0.0-47848F?logo=electron)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)

## ✨ Features

- **Frameless Window Design** - Custom title bar with seamless integration
- **Liquid Glass UI** - Advanced glassmorphism with backdrop blur effects
- **Deep Black Theme** - Deepest void black (#050505) with electric purple accents (#8A2BE2)
- **Purple Glow Effects** - Dynamic animations and hover states
- **Cross-Platform** - Builds for Linux (RPM, AppImage), Windows (EXE), and macOS (DMG)

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Building

```bash
# Build for Linux (RPM and AppImage)
npm run build:linux

# Build for Windows
npm run build:win

# Build for macOS
npm run build:mac

# Build for all platforms
npm run build:all
```

## 🎨 Design System

### Colors

- **Void Black**: `#050505` - Primary background
- **Electric Purple**: `#8A2BE2` - Primary accent
- **Purple Glow**: `#9D4EDD` - Hover states
- **Purple Dark**: `#6B21A8` - Active states

### Effects

- **Liquid Glass**: Semi-transparent layers with backdrop blur
- **Purple Glow**: Dynamic shadow animations on interactive elements
- **Smooth Transitions**: 300ms ease-in-out for all interactions

## 📁 Project Structure

```
vibes-Desktop/
├── main.js                 # Electron main process
├── preload.js             # IPC bridge
├── index.html             # HTML entry point
├── package.json           # Dependencies & build config
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind theme
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # Main app component
    ├── index.css          # Global styles
    └── components/
        ├── TitleBar.jsx   # Custom title bar
        ├── Sidebar.jsx    # Navigation sidebar
        ├── Player.jsx     # Bottom player
        └── MainContent.jsx # Main content area
```

## 🔧 Configuration

### Electron Builder

The app is configured to build for multiple platforms:

- **Linux**: RPM (Fedora) and AppImage (Universal)
- **Windows**: NSIS installer
- **macOS**: DMG

Build configuration is in `package.json` under the `build` key.

### Window Configuration

- **Frameless**: `frame: false` for custom title bar
- **Size**: 1400x900 (min: 1200x700)
- **Background**: Deep black (#050505)
- **Security**: Context isolation, sandbox enabled

## 🎯 Key Components

### TitleBar

Custom draggable title bar with window controls (minimize, maximize, close) and Vibes logo.

### Sidebar

Fixed 240px width navigation with glassmorphic background, featuring:

- Navigation menu (Discover, Search, Collection)
- Playlists section

### Player

Bottom player bar with frosted glass effect, including:

- Playback controls
- Progress bar with purple gradient
- Volume control
- Track information

### MainContent

Scrollable content area with:

- Featured artist section
- Vibe Curation grid
- New Waves grid

## 🛠️ Development

The app uses:

- **Vite** for fast development and building
- **React** for UI components
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Development Mode

```bash
npm run dev
```

This will:

1. Start Vite dev server on port 5173
2. Launch Electron window
3. Enable hot module replacement
4. Open DevTools automatically

## 📦 Building for Production

```bash
# Build the React app
npm run build

# Build for your platform
npm run build:linux   # For Linux
npm run build:win     # For Windows
npm run build:mac     # For macOS
```

Built files will be in the `dist/` directory.

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
colors: {
  void: {
    DEFAULT: '#050505',  // Background color
  },
  purple: {
    electric: '#8A2BE2', // Primary accent
  },
}
```

### Modifying Layout

- Sidebar width: Edit `w-60` class in `Sidebar.jsx`
- Player height: Edit `h-24` class in `Player.jsx`
- Window size: Edit `width` and `height` in `main.js`

## 📄 License

MIT

## 🙏 Acknowledgments

Built with modern web technologies and inspired by premium music player designs.
# vibes
