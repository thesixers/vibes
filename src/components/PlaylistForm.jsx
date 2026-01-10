import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSync } from "../context/SyncContext";
import { db } from "../data/db";

const PlaylistForm = () => {
  const { showPlaylistForm, setShowPlaylistForm } = useSync();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const createPlaylist = async () => {
    if (!name) return alert("A name is required for a playlist");

    setCreating(true)
    try {
      let newPlaylist = await db.playlists.add({
        title: name,
        song_ids: [],
        created_at: String(Date.now()),
        updated_at: String(Date.now()),
      });

      console.log(newPlaylist);
    } catch (err) {
      console.error(err);
    }finally{
      setCreating(false)
      setShowPlaylistForm(false)
    }
  };


  if (!showPlaylistForm) return null;

  return (
    <div className="absolute bg-black/50 w-full h-full z-[999] flex justify-center items-center">
      <div className="relative p-5 w-96 max-h-[calc(100vh-200px)] glass-strong rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 z-50">
        <X
          className="absolute right-5 cursor-pointer text-gray-500 hover:text-gray-200 duration-300"
          onClick={() => setShowPlaylistForm(false)}
        />
        <h2 className="text-center text-[20px] font-semibold">New Playlist</h2>
        <div className="mt-5 flex flex-col gap-5">
          <input
            type="text"
            className="w-full p-3 border border-gray-600 outline-none rounded-lg bg-black/30 text-[15px] text-white/70"
            placeholder="Name your playlist"
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="p-2 pt-3 pb-3 cursor-pointer bg-black/55 rounded-lg"
            onClick={createPlaylist}
          >
            create
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistForm;
