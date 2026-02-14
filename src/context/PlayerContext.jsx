import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

const PlayerContext = createContext(null);

export const usePlayer = () => useContext(PlayerContext);

const STORAGE_KEY = "vibes-player-state";

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());

  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [originalQueue, setOriginalQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const [volume, setVolume] = useState(70);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  // -------------------------
  // Local Storage Helpers
  // -------------------------
  const checkPlayerState = () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) ? true : false;
  };

  const getPlayerState = () => {
    if (!checkPlayerState()) return null;
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  };

  const updatePlayerState = (key, value) => {
    if (typeof window === "undefined") return;

    const currentState = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const newState = { ...currentState, [key]: value };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const createPlayerState = () => {
    if (typeof window === "undefined") return;

    const initialState = {
      queue: [],
      originalQueue: [],
      currentIndex: -1,
      isShuffling: false,
      isRepeating: false,
      progress: 0,
      volume: 70,
      currentTrackDuration: 0,
      currentTrack: null,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
  };

  // -------------------------
  // Core Audio Functions
  // -------------------------
  const loadAndPlay = useCallback((track) => {
    if (!track) return;

    setCurrentTrack(track);
    updatePlayerState("currentTrack", track);

    audioRef.current.src = track.file_path;
    audioRef.current.play();
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;

    if (!audio.src) return;

    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const seek = useCallback((percent) => {
    const audio = audioRef.current;

    if (!audio.duration) return;

    const time = (percent / 100) * audio.duration;
    audio.currentTime = time;
    setProgress(percent);
    updatePlayerState("progress", percent);
  }, []);

  // -------------------------
  // Track Navigation
  // -------------------------
  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;

    const nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      setIsPlaying(false);
      return;
    }

    setCurrentIndex(nextIndex);
    updatePlayerState("currentIndex", nextIndex);

    loadAndPlay(queue[nextIndex]);
  }, [queue, currentIndex, loadAndPlay]);

  const prevTrack = useCallback(() => {
    const audio = audioRef.current;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    if (queue.length === 0) return;

    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      prevIndex = 0;
    }

    setCurrentIndex(prevIndex);
    updatePlayerState("currentIndex", prevIndex);

    loadAndPlay(queue[prevIndex]);
  }, [queue, currentIndex, loadAndPlay]);

  // -------------------------
  // Playlist / Queue Actions
  // -------------------------
  const playTrack = useCallback(
    (track) => {
      if (!track) return;

      setQueue([track]);
      setOriginalQueue([track]);
      setCurrentIndex(0);

      updatePlayerState("queue", [track]);
      updatePlayerState("originalQueue", [track]);
      updatePlayerState("currentIndex", 0);

      loadAndPlay(track);
    },
    [loadAndPlay]
  );

  const playPlaylist = useCallback(
    (tracks, startIndex = 0) => {
      if (!tracks || tracks.length === 0) return;

      setQueue(tracks);
      setOriginalQueue(tracks);
      setCurrentIndex(startIndex);

      updatePlayerState("queue", tracks);
      updatePlayerState("originalQueue", tracks);
      updatePlayerState("currentIndex", startIndex);

      loadAndPlay(tracks[startIndex]);
    },
    [loadAndPlay]
  );

  const shuffleQueue = useCallback(() => {
    if (!originalQueue.length) return;

    const shuffled = [...originalQueue].sort(() => Math.random() - 0.5);

    setQueue(shuffled);
    updatePlayerState("queue", shuffled);
  }, [originalQueue]);

  const toggleShuffle = useCallback(() => {
    setIsShuffling((prev) => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeating((prev) => {
      updatePlayerState("isRepeating", !prev);
      return !prev;
    });
  }, []);

  // -------------------------
  // Load Saved State (on mount)
  // -------------------------
  useEffect(() => {
    if (!checkPlayerState()) {
      createPlayerState();
      return;
    }

    const saved = getPlayerState();
    if (!saved) return;

    setQueue(saved.queue || []);
    setOriginalQueue(saved.originalQueue || []);
    setCurrentIndex(saved.currentIndex ?? -1);
    setIsRepeating(saved.isRepeating || false);
    setIsShuffling(saved.isShuffling || false);
    setProgress(saved.progress || 0);
    setVolume(saved.volume ?? 70);

    const track = saved.queue?.[saved.currentIndex];
    if (track) {
      setCurrentTrack(track);
      audioRef.current.src = track.file_path;
      audioRef.current.currentTime = saved.currentTrackDuration || 0;
    }
  }, []);

  // -------------------------
  // Volume Sync
  // -------------------------
  useEffect(() => {
    audioRef.current.volume = volume / 100;
    updatePlayerState("volume", volume);
  }, [volume]);

  // -------------------------
  // Shuffle Effect
  // -------------------------
  useEffect(() => {
    updatePlayerState("isShuffling", isShuffling);

    if (isShuffling) {
      shuffleQueue();
    } else {
      setQueue(originalQueue);
      updatePlayerState("queue", originalQueue);
    }
  }, [isShuffling, originalQueue, shuffleQueue]);

  // -------------------------
  // Audio Event Listeners
  // -------------------------
  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (!audio.duration) return;

      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(percent);
      updatePlayerState("progress", percent);
      updatePlayerState("currentTrackDuration", audio.currentTime);
    };

    const handleEnded = () => {
      if (isRepeating && queue[currentIndex]) {
        loadAndPlay(queue[currentIndex]);
        return;
      }

      nextTrack();
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isRepeating, queue, currentIndex, loadAndPlay, nextTrack]);

  // -------------------------
  // Media Session Controls
  // -------------------------
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler("previoustrack", prevTrack);
    navigator.mediaSession.setActionHandler("nexttrack", nextTrack);

    navigator.mediaSession.setActionHandler("play", () => {
      if (!isPlaying) togglePlay();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      if (isPlaying) togglePlay();
    });
  }, [prevTrack, nextTrack, togglePlay, isPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        volume,
        queue,
        isShuffling,
        isRepeating,
        setVolume,
        playTrack,
        playPlaylist,
        togglePlay,
        seek,
        nextTrack,
        prevTrack,
        toggleShuffle,
        toggleRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
