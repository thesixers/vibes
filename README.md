# 🎧 VIBES — Desktop Music Player

_A GeNeSix App_

---

## About Vibes

Vibes is a desktop music player I built because… honestly?  
Most Linux music players look boring. Flat. Lifeless.  
So I decided to build one that actually looks and feels good.

I chose **Electron** so Vibes can run on:

- 🐧 Linux
- 🍎 macOS
- 🪟 Windows

One codebase, all platforms.

---

## How It Works

1. You download and open Vibes.
2. The app scans your **default Music folder**.
3. For each song, it generates a search query.
4. That query is sent to the **Vibes Spotify server**.
5. Spotify returns the real song details (title, artist, cover art, etc).
6. Only songs that successfully match get saved locally using:
   - **IndexedDB**
   - Powered by **Dexie.js**

So your local music ends up looking clean, organized, and beautiful.

---

## Who It’s For

Vibes is for people who still love:

- Downloading music
- Owning their files
- Listening locally without streaming drama

Old-school style, modern UI.

---

# 📥 Installation Guide

Vibes is available for Windows, macOS, and Linux. Choose your operating system below for instructions.

## 🪟 Windows

1.  Download the latest `Vibes-Setup-x.x.x.exe` from the [Releases page](#).
2.  Double-click the downloaded file to launch the installer.
3.  The app will automatically install and launch.
4.  A shortcut will be added to your desktop and start menu.

> **Note:** If you see a "Windows protected your PC" warning (SmartScreen), click **"More info"** and then **"Run anyway"**. This happens because the app is currently unsigned.

---

## 🍎 macOS

1.  Download the latest `Vibes-x.x.x.dmg` from the [Releases page](#).
2.  Double-click the `.dmg` file to open it.
3.  Drag the **Vibes** icon into the **Applications** folder.
4.  Open your Applications folder and launch Vibes.

> **Note:** If you see a warning that the app "cannot be opened because it is from an unidentified developer":
>
> 1. Right-click (or Control-click) the app icon.
> 2. Select **Open**.
> 3. Click **Open** in the dialog box that appears.

---

## 🐧 Linux

We provide an **AppImage** which works on most Linux distributions (Ubuntu, Fedora, Debian, Arch, etc.).

1.  Download the latest `Vibes-x.x.x.AppImage` from the [Releases page](#).
2.  **Important:** You must make the file executable before running it.

Open your terminal in the download location and run:

```bash
chmod +x Vibes-*.AppImage
./Vibes-*.AppImage
```

---

## Contributing

You’re free to:

- Clone it
- Tweak it
- Redesign it
- Break it and fix it again

If you make something cool, feel free to contribute it back to the repo.

---

_Don't forget to leave a ⭐ if you like the project!_

> **NA.**
