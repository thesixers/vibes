export const mockUser = {
  id: "user-1",
  username: "GeneSix",
  avatar_path: "https://api.dicebear.com/7.x/avataaars/svg?seed=GeneSix",
  is_admin: true,
};

export const mockArtists = [
  {
    id: "artist-1",
    name: "Solange",
    bio: "Solange Piaget Knowles is an American singer, songwriter, and actress.",
    image_path:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",
  },
  {
    id: "artist-2",
    name: "Burna Boy",
    bio: "Damini Ebunoluwa Ogulu, known professionally as Burna Boy, is a Nigerian singer.",
    image_path:
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80",
  },
];

export const mockAlbums = [
  {
    id: "album-1",
    title: "A Seat at the Table",
    artist_id: "artist-1",
    release_year: "2016",
    cover_image_path:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80",
  },
  {
    id: "album-2",
    title: "Love, Damini",
    artist_id: "artist-2",
    release_year: "2022",
    cover_image_path:
      "https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&q=80",
  },
];

export const mockSongs = [
  {
    id: "song-1",
    title: "Cranes in the Sky",
    album_id: "album-1",
    duration: 250,
    file_path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    artists: ["Solange"],
    is_liked: true,
  },
  {
    id: "song-2",
    title: "Last Last",
    album_id: "album-2",
    duration: 172,
    file_path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    artists: ["Burna Boy"],
    is_liked: false,
  },
  {
    id: "song-3",
    title: "Kilometre",
    album_id: "album-2",
    duration: 153,
    file_path: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    artists: ["Burna Boy"],
    is_liked: true,
  },
];

export const mockPlaylists = [
  {
    id: "playlist-1",
    title: "Your Tech",
    description: "The best tech vibes for coding.",
    owner_name: "GeneSix",
    cover_image_path:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
    songs: [mockSongs[0], mockSongs[1]],
  },
  {
    id: "playlist-2",
    title: "Earthon",
    description: "Natural sounds and acoustic vibes.",
    owner_name: "GeneSix",
    cover_image_path:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
    songs: [mockSongs[2]],
  },
  {
    id: "playlist-3",
    title: "Solange Essentials",
    description: "All the hits from Solange.",
    owner_name: "Vibes",
    cover_image_path:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80",
    songs: [mockSongs[0]],
  },
  {
    id: "playlist-4",
    title: "Afrobeats 2024",
    description: "The hottest Afrobeats tracks.",
    owner_name: "Vibes",
    cover_image_path:
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&q=80",
    songs: [mockSongs[1], mockSongs[2]],
  },
];
