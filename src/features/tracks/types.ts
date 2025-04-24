export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  coverImage?: string;
  audioFile?: string;
}

export interface TracksResponse {
  data: Track[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
