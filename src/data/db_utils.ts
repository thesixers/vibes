// services/addSong.ts
import { db, Song } from "./db";

export async function addFullSong(track: any) {
  return await db.transaction(
    "rw",
    db.artists,
    db.albums,
    db.songs,
    async () => {
      // 1. Add/Find the Album first
      let albumId = await db.albums
        .where("id")
        .equals(track.album.id)
        .first()
        .then((a) => a?.id);

      if (!albumId) {
        albumId = await db.albums.add({
          id: track.album.id,
          title: track.album.name,
          release_date: track.album.release_date,
          total_tracks: track.album.total_tracks,
          images: track.album.images,
          type: track.album.type,
        });
      }

      // 2. Add/Find all Artists and collect IDs
      const artistIds: string[] = [];
      for (const art of track.artists) {
        let aId = await db.artists
          .where("id")
          .equals(art.id)
          .first()
          .then((a) => a?.id);

        if (!aId) {
          aId = await db.artists.add({
            id: art.id,
            name: art.name,
            genres: art.genres,
            images: art.images,
          });
        }
        artistIds.push(aId);
      }

      // 3. Finally, Add the Song linking them
      await db.songs.add({
        id: track.id,
        title: track.name,
        file_path: track.file_path,
        duration: track.duration_ms,
        release_date: track.release_date,
        track_number: track.track_number,
        album_id: albumId,
        artist_ids: artistIds,
        images: track.album.images,
        is_spotify: track.is_spotify,
        popularity: track.popularity,
        is_liked: false,
        is_backed_up: false,
      });
    }
  );
}