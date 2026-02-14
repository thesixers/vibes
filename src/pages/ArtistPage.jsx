import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Disc, 
  Mic2, 
  Clock, 
  Music, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { db } from "../data/db";
import { formatDuration } from "../data/utils";
import Loading from "../components/Loading";
import { motion } from "framer-motion";

const ArtistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playPlaylist, currentTrack, isPlaying, togglePlay } = usePlayer();

  const artistData = useLiveQuery(async () => {
    if (!id) return null;
    const artist = await db.artists.get(id);
    if (!artist) return null;

    // Direct filter for more accurate relational fetching
    const rawSongs = await db.songs.filter(song => song.artist_ids.includes(id)).toArray();

    const hydratedSongs = await Promise.all(
      rawSongs.map(async (song) => {
        const album = await db.albums.get(song.album_id);
        const artists = await db.artists.bulkGet(song.artist_ids);
        return { ...song, album, artists };
      })
    );

    const albumMap = new Map();
    hydratedSongs.forEach((song) => {
      if (song.album && !albumMap.has(song.album.id)) {
        albumMap.set(song.album.id, song.album);
      }
    });

    const albums = Array.from(albumMap.values()).sort((a, b) => 
      new Date(b.release_date) - new Date(a.release_date)
    );

    return { artist, songs: hydratedSongs, albums };
  }, [id]);

  if (!artistData) return <Loading />;

  const { artist, songs, albums } = artistData;
  const artistImage = artist.images?.[0]?.url || albums[0]?.images?.[0]?.url;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-bgMain pb-32">
      
      {/* --- MATURE MINIMAL HEADER --- */}
      <div className="relative shrink-0 p-6 md:p-12 border-b border-slate-100 dark:border-white/5">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-end max-w-7xl mx-auto">
          
          {/* Back Navigation */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 p-2 rounded-xl border border-slate-200 dark:border-white/10 text-text-muted hover:text-primary hover:border-primary/30 transition-all"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>

          {/* Clean Profile Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-48 h-48 md:w-64 md:h-64 rounded-[2rem] overflow-hidden bg-surface shadow-sm border border-slate-200 dark:border-white/10 shrink-0"
          >
            {artistImage ? (
              <img src={artistImage} className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700" alt={artist.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted/20">
                <Mic2 size={60} />
              </div>
            )}
          </motion.div>

          {/* Identity Block */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted border border-slate-200 dark:border-white/10 px-3 py-1 rounded-md">
                Verified Artist
              </span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-text-main tracking-tighter uppercase leading-none">
              {artist.name}
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-6 font-bold text-text-muted text-[11px] uppercase tracking-[0.15em]">
              <span className="border-b-2 border-primary/20 pb-1">{songs.length} Tracks</span>
              <span className="border-b-2 border-slate-100 dark:border-white/10 pb-1">{albums.length} Releases</span>
            </div>

            <div className="pt-4">
              <button
                onClick={() => playPlaylist(songs, 0)}
                className="h-14 px-10 bg-text-main text-bgMain rounded-xl font-black text-sm uppercase tracking-widest shadow-md hover:bg-primary hover:text-white transition-all active:scale-95"
              >
                Play Everything
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT LAYOUT --- */}
      <div className="flex-1 px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto w-full">
        
        {/* LEFT: TRACKLIST (High Density) */}
        <div className="lg:col-span-8">
          <h2 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
            Comprehensive Catalog
            <div className="h-px w-8 bg-primary/40" />
          </h2>

          <div className="space-y-1">
            {songs.map((song, index) => {
              const isCurrent = currentTrack?.id === song.id;
              return (
                <div
                  key={song.id}
                  onClick={() => playPlaylist(songs, index)}
                  className={`group flex items-center gap-6 p-3 rounded-xl transition-all cursor-pointer border ${
                    isCurrent 
                    ? "bg-surface border-primary/20 shadow-sm" 
                    : "border-transparent hover:bg-surface hover:border-slate-100 dark:hover:border-white/5"
                  }`}
                >
                  <div className="w-8 text-center text-[10px] font-black text-text-muted">
                    {isCurrent && isPlaying ? (
                       <span className="text-primary tracking-tighter">PLAYING</span>
                    ) : (
                       <span className="group-hover:text-primary transition-colors">{(index + 1).toString().padStart(2, '0')}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate ${isCurrent ? "text-primary" : "text-text-main"}`}>
                      {song.title}
                    </h4>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider truncate">
                      {song.album?.title || "Single"}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-mono font-bold text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatDuration(song.duration)}
                    </span>
                    <ChevronRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: RELEASES (Clean Grid) */}
        <div className="lg:col-span-4 space-y-10">
          <section>
            <h2 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-8">Releases</h2>
            <div className="grid grid-cols-1 gap-6">
              {albums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => navigate(`/playlist/${album.id}`)}
                  className="group flex gap-4 cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-white/5">
                    <img
                      src={album.images?.[1]?.url || album.images?.[0]?.url}
                      alt={album.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h3 className="font-bold text-text-main text-xs uppercase truncate leading-tight group-hover:text-primary transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">
                      {new Date(album.release_date).getFullYear()}
                    </p>
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <ExternalLink size={12} className="text-primary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default ArtistPage;