# 🎵 Vibes Desktop
> **A GeNeSix App**

![Electron](https://img.shields.io/badge/built%20with-Electron-2F3241?style=flat&logo=electron&logoColor=white)  
![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Mac%20%7C%20Windows-lightgrey)  
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Vibes** is a cross-platform desktop music player built with Electron.

It was born out of frustration with existing Linux music players, which often felt boring or lacked aesthetic appeal. Vibes is designed for those who still appreciate the classic way of downloading music and listening locally, but want a modern, beautiful UI.

---

## ✨ Features

- **Cross-Platform:** Runs smoothly on Linux, macOS, and Windows.  
- **Modern UI:** A fresh, stylish alternative to traditional music players.  
- **Smart Metadata:** Automatically fetches song details and cover art via the custom Vibes Spotify Server.  
- **Local First:** Optimized for local file management with offline caching.  

---

## 🛠️ How It Works

1. **Scan:** Upon launch, the app loads music files from your system's default Music folder.  
2. **Query:** It generates a search query based on the file metadata.  
3. **Resolve:** The query is sent to the **Vibes Spotify Server** to fetch accurate details (Artist, Title, Album Art).  
4. **Cache:** Successful matches are stored locally using **Dexie.js** (IndexedDB) to ensure instant loading in the future without re-fetching.  

---

## 💻 Tech Stack

- **Framework:** [Electron](https://www.electronjs.org/)  
- **Database:** [Dexie.js](https://dexie.org/) (IndexedDB wrapper)  
- **Backend Integration:** Vibes Spotify Server  

---

## 🚀 Getting Started

To run this project locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/your-username/vibes-desktop.git

# Go into the repository
cd vibes-desktop

# Install dependencies
npm install

# Run the app
npm start

## 🤝 Contributing

This is an open project! Anyone is allowed to clone, tweak, or redesign the app to suit their taste.

- Found a bug? Open an issue.  
- Have an idea? Submit a Pull Request.  

---

**Created by NA.**  
*Don't forget to leave a ⭐ if you like the project!*

---

**— NA.**
