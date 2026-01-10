import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Play, Pause, Disc, Mic2, Clock, Music } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { db } from "../data/db";
import { formatDuration } from "../data/utils"; // Ensure correct path
import Loading from "../components/Loading";

const ArtistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playPlaylist, currentTrack, isPlaying, togglePlay } = usePlayer();

  // --- SMART DATA FETCHING ---
  const artistData = useLiveQuery(async () => {
    if (!id) return null;

    // 1. Fetch Artist Details (Using ID directly as string/number based on DB)
    // Dexie will auto-handle type if your schema is defined correctly.
    const artist = await db.artists.get(id);

    if (!artist) return null;

    // 2. Fetch All Songs by this Artist
    const rawSongs = await db.songs.where("artist_ids").equals(id).toArray();

    // 3. Hydrate Songs (Add Album info for images)
    const songs = await Promise.all(
      rawSongs.map(async (song) => {
        const album = await db.albums.get(song.album_id);
        const artists = await db.artists
          .where("id")
          .anyOf(song.artist_ids)
          .toArray();
        return { ...song, album, artists };
      })
    );

    // 4. Extract Unique Albums
    const albumMap = new Map();
    songs.forEach((song) => {
      if (song.album && song.album?.type === "album" && !albumMap.has(song.album.id)) {
        albumMap.set(song.album.id, song.album);
      }
    });
    const albums = Array.from(albumMap.values());

    return {
      artist,
      songs,
      albums,
      topSongs: songs.slice(0, 10), // Show top 10 for a fuller list
    };
  }, [id]);

  if (!artistData)
    return (
      <Loading />
    );

  const { artist, songs, albums, topSongs } = artistData;

  // Use the image of the first album as a fallback cover if artist has no image
  const artistImage =
    artist.images?.[0]?.url || albums[0]?.images?.[0]?.url || null;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-black pb-32">
      {/* --- MODERN HEADER DESIGN --- */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        {/* Full Bleed Background */}
        <div className="absolute inset-0">
          {artistImage ? (
            <img
              src={artistImage}
              alt={artist.name}
              className="w-full h-full object-cover opacity-60 mask-gradient-bottom"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-zinc-800 to-black" />
          )}
          {/* Custom Gradient Mask for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>

        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Artist Info - Left Aligned, Bold Typography */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-10 flex flex-col justify-end items-start gap-6">
          {/* Tag */}
          <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/5">
            <Mic2 size={12} className="text-purple-electric" />
            <span className="text-xs font-bold tracking-widest text-white uppercase">
              Artist
            </span>
          </div>

          {/* Name - Huge & Tight */}
          <h1 className="text-6xl font-vibes md:text-9xl font-black text-white tracking-tighter leading-none mix-blend-overlay opacity-90">
            {artist.name}
          </h1>

          {/* Meta Row */}
          <div className="flex items-center gap-6 text-white/60 font-medium">
            <span>{songs.length} Tracks</span>
            <span className="w-1 h-1 bg-white/40 rounded-full" />
            <span>{albums.length} Releases</span>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => playPlaylist(songs, 0)}
              className="h-14 px-8 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Play size={20} fill="black" /> PLAY
            </button>
            <button className="h-14 w-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <Music size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
        {/* --- LEFT COLUMN: TRACKS --- */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            Top Tracks
            <span className="text-sm font-normal text-white/40">
              Most played
            </span>
          </h2>

          <div className="space-y-1">
            {topSongs.map((song, index) => {
              const isCurrent = currentTrack?.id === song.id;
              const img =
                song.album?.images?.[2]?.url || song.album?.images?.[0]?.url;

              return (
                <div
                  key={song.id}
                  onClick={() => {
                    if (currentTrack && currentTrack.id === song.id)
                      return togglePlay();

                    playPlaylist(topSongs, index);
                  }}
                  className={`
                                group flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer border border-transparent
                                ${
                                  isCurrent
                                    ? "bg-white/10 border-white/5"
                                    : "hover:bg-white/5 hover:border-white/5"
                                }
                            `}
                >
                  <span className="w-6 text-center text-white/30 font-mono text-sm group-hover:hidden">
                    {index + 1}
                  </span>
                  <span className="w-6 hidden group-hover:flex justify-center text-white">
                    <Play size={14} fill="white" />
                  </span>

                  {img ? (
                    <img
                      src={img}
                      alt=""
                      className="w-12 h-12 rounded bg-white/5 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center">
                      <Music size={16} className="text-white/20" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-medium truncate text-base ${
                        isCurrent ? "text-purple-electric" : "text-white"
                      }`}
                    >
                      {song.title}
                    </h4>
                    <p className="text-xs text-white/40 truncate">
                      {song.album?.title}
                    </p>
                  </div>

                  <div className="text-white/30 text-xs font-mono">
                    {formatDuration(song.duration)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- RIGHT COLUMN: DISCOGRAPHY --- */}
        <div className="space-y-8">
          {albums.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-6">
                Latest Releases
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {albums.slice(0, 4).map((album) => (
                  <div
                    key={album.id}
                    onClick={() => navigate(`/playlist/${album.id}`)}
                    className="group cursor-pointer space-y-3"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-white/5 relative">
                      {album.images?.[0]?.url ? (
                        <img
                          src={album.images[0].url}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          <Disc />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm truncate group-hover:underline decoration-white/30 underline-offset-4">
                        {album.title}
                      </h3>
                      <p className="text-xs text-white/40">
                        {new Date(album.release_date).getFullYear()} • Album
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {albums.length > 4 && (
                <button className="mt-6 w-full py-3 rounded-lg border border-white/10 text-sm font-bold text-white hover:bg-white/5 transition-colors">
                  View Discography
                </button>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
