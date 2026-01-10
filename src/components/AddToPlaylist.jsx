import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { db } from "../data/db";

const AddToPlaylist = () => {
  const allPlaylists = useLiveQuery(async() => {
    const rawPlaylists = await db.playlists.toArray();
    const lists = await Promise.all(
        rawPlaylists.map(async (list) => {
            const songs = await db.songs.where("id").anyOf(list.song_ids).toArray();
            return  { ...list, songs}
        })
    )
    
    return lists;
  }) || [];

  const handleAddToPlaylist = async (playlistId) => {
    if (!songToAction) return;
    try {
      const playlist = await db.playlists.get(playlistId);
      if (playlist) {
        playlist.song_ids = playlist.song_ids || [];
        const inPlaylist = playlist?.song_ids.includes(songToAction);

        if (!inPlaylist) {
          await db.playlists.update(playlist.id, {
            song_ids: [...playlist.song_ids, songToAction],
          });
        }
      }
      setShowPlaylistModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSongToAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-white font-bold">Add to Playlist</h3>
          <button
            onClick={() => setShowPlaylistModal(false)}
            className="text-white/50 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {allPlaylists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => handleAddToPlaylist(pl.id)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded bg-white/5 overflow-hidden flex-shrink-0">
                {pl.cover_image?.url ? (
                  <img
                    src={pl.cover_image.url}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  <Music className="w-5 h-5 m-auto text-white/30" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{pl.title}</p>
                <p className="text-xs text-white/50">
                  {pl.song_ids ? pl.song_ids.length : 0} songs
                </p>
              </div>
              {pl.song_ids.includes(songToAction) && (
                <Check size={16} className="text-green-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylist;
