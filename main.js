import { app, BrowserWindow, ipcMain, protocol } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { parseFile } from "music-metadata";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    frame: false, // CRITICAL: Frameless window for custom title bar
    backgroundColor: "#050505",
    icon: path.join(__dirname, "assets/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: false,
    },
  });

  // Load the app
  if (!app.isPackaged || process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "dist-vite/index.html"));
  }
}

// Window control IPC handlers
ipcMain.on("window-minimize", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on("window-maximize", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on("window-close", () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle("load-music-library", async () => {
  const musicPath = app.getPath("music");
  const files = fs.readdirSync(musicPath);
  const tracks = [];

  for (const file of files) {
    const filePath = path.join(musicPath, file);
    const { common } = await parseFile(filePath);
    const track = {
      artists: common.artists,
      artist:
        common.album && common.album.toLowerCase() === "trendybeatz.com"
          ? common.composer.join(" ")
          : cleanArtist(common.artist),
      title: cleanTitle(common, file),
      album: common.album,
      path: `file://${filePath}`,
      duration: common.duration,
    };

    track.query = `${track.title} ${track.artist}`
      .replace(/\./g, "")
      .replace(/\,/g, "")
      .replace(/\:/g, "");

    tracks.push(track);
    // console.log("================================== " + files.indexOf(file));
  }

  return tracks;
});

const junks = [
  "ft.",
  "feat.",
  "feat",
  "ft",
  "feat.",
  "prod.",
  "via:",
  "prod:",
  "via",
  "prod",
  "-",
  "9jaflaver.com",
  "x",
  "&",
];

// Register the custom protocol
protocol.registerSchemesAsPrivileged([
  { scheme: 'media', privileges: { secure: true, standard: true, supportFetchAPI: true, stream: true } }
]);

app.whenReady().then(() => {
  // Define how 'media://' works
  protocol.handle("media", (request) => {
    // Convert "media://path/to/song.mp3" -> "file:///path/to/song.mp3"
    const url = request.url.replace("media://", "");
    // Decode URI (fixes spaces like "Feeling%20The%20Nigga")
    return net.fetch("file://" + decodeURIComponent(url));
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      // Define how 'media://' works
      protocol.handle("media", (request) => {
        // Convert "media://path/to/song.mp3" -> "file:///path/to/song.mp3"
        const url = request.url.replace("media://", "");
        // Decode URI (fixes spaces like "Feeling%20The%20Nigga")
        return net.fetch("file://" + decodeURIComponent(url));
      });
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

function cleanTitle(common, file) {
  const title = common.title
    ? common.title.replaceAll("(", "").replaceAll(")", "").split("|")[0]
    : file
        .split("_")
        .join(" ")
        .split("-")
        .join(" ")
        .replace(`${path.extname(file)}`, "");

  let cTitle = "";
  for (const a of title.split(" ")) {
    if (!junks.includes(a.toLowerCase())) {
      cTitle += a + " ";
    } else {
      cTitle += "";
    }
  }

  return cTitle.trim();
}

function cleanArtist(artist) {
  if (!artist) return "";

  let cArtist = "";
  for (const a of artist.split(" ")) {
    if (!junks.includes(a.toLowerCase())) {
      cArtist += a + " ";
    } else {
      cArtist += "";
    }
  }

  return cArtist.trim();
}
