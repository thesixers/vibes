import { Check, Music, Play, X } from "lucide-react";
import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../data/db";
import PlaylistForm from "./PlaylistForm";
import { useSync } from "../context/SyncContext";

export default function AddtoPlayList({ songToAction, setSongToAction }) {
  const { showPlaylistForm, setShowPlaylistForm } = useSync();
  const allPlaylists = useLiveQuery(() => db.playlists.toArray()) || [];

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
      setSongToAction(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSongToAction(null);
    }
  };

  const handleRemoveFromPlaylist = async (playlistId) => {
    if (!songToAction) return;
    try {
      const playlist = await db.playlists.get(playlistId);
      if (playlist) {
        playlist.song_ids = playlist.song_ids || [];
        const inPlaylist = playlist?.song_ids.includes(songToAction);

        if (inPlaylist) {
          await db.playlists.update(playlist.id, {
            song_ids: playlist.song_ids.filter((id) => id !== songToAction),
          });
        }
      }
      setSongToAction(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSongToAction(null);
    }
  };

  if (!songToAction) return null;

  return (
    <>
      {/* playlist form */}
      {showPlaylistForm && <PlaylistForm />}
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="text-white font-bold">Add to Playlist</h3>
            <button
              onClick={() => setSongToAction(null)}
              className="text-white/50 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {allPlaylists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => {
                  if (pl.song_ids.includes(songToAction)) {
                    handleRemoveFromPlaylist(pl.id);
                  } else {
                    handleAddToPlaylist(pl.id);
                  }
                }}
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
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => setShowPlaylistForm(true)}
              className="w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Create New Playlist
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
