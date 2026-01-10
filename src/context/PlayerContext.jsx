import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isShuffling, isRepeating, currentIndex, queue]);

  useEffect(() => {
    audioRef.current.volume = volume / 100;
  }, [volume]);

  const playTrack = (track) => {
    setQueue([track]);
    setCurrentIndex(0);
    loadAndPlay(track);
  };

  const playPlaylist = (tracks, startIndex = 0) => {
    setQueue(tracks);
    setCurrentIndex(startIndex);
    loadAndPlay(tracks[startIndex]);
  };

  const loadAndPlay = (track) => {
    if (!track) return;
    setCurrentTrack(track);
    audioRef.current.src = track.file_path;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioRef.current.src) {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (percent) => {
    if (audioRef.current.duration) {
      const time = (percent / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(percent);
    }
  };

  const nextTrack = () => {
    if (queue.length === 0) return;

    let nextIndex;
    if (isShuffling) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex >= queue.length) {
      if (isRepeating) {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        setProgress(0);
        return; // End of queue
      }
    }

    console.log(nextIndex);
    setCurrentIndex(nextIndex);
    loadAndPlay(queue[nextIndex]);
  };

  const prevTrack = () => {
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (queue.length === 0) return;

    let prevIndex;
    if (isShuffling) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else {
      prevIndex = currentIndex - 1;
    }

    if (prevIndex < 0) {
      prevIndex = queue.length - 1; // Loop back to end
    }

    setCurrentIndex(prevIndex);
    loadAndPlay(queue[prevIndex]);
  };

  const toggleShuffle = () => setIsShuffling(!isShuffling);

  const toggleRepeat = () => setIsRepeating(!isRepeating);

  // devices key board controls
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler("previoustrack", () => {
      prevTrack();
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      nextTrack();
    });

    navigator.mediaSession.setActionHandler("play", () => {
      if (!isPlaying) togglePlay();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      if (isPlaying) togglePlay();
    });
  }, [nextTrack, prevTrack, isPlaying, togglePlay]);

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
