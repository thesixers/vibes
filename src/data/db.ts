import Dexie, { Table } from "dexie";

export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Song {
    id: string;
    title: string;
    artist_ids: string[]; //f
    file_path: string;
    duration: number;
    release_date: string;
    track_number: number;
    album_id: string; //f
    images: Image[];
    is_spotify: boolean;
    popularity: number;
    is_liked: boolean;
}

export interface Playlist {
    id: number;
    title: string;
    description: string;
    cover_image: Image;
    song_ids: string[];
    created_at: string;
    updated_at: string;
}

export interface Artist {
    id: string;
    name: string;
    genres: string[];
    images: Image[];
}

// dont pust artist_id in album
export interface Album {
    id: string;
    title: string;
    total_tracks: number;
    release_date: string;
    images: Image[];
}

class VibeDB extends Dexie {
    artists!: Table<Artist, string>;
    albums!: Table<Album, string>;
    songs!: Table<Song, string>;
    playlists!: Table<Playlist, number>;

    constructor() {
        super("vibesDB");
        this.version(1).stores({
            artists: "id, name, genres", 
            albums: "id, title, total_tracks, release_date", 
            songs: "id, title, file_path, duration, release_date, track_number, *artist_ids, is_spotify, popularity, album_id", 
            playlists: "++id, title, description, cover_image, *songs, created_at, updated_at",
        }); 
    }
}

export const db = new VibeDB();