type LyricLine = {
  text: string;
  duration: number;
  from: number;
};

type Song = LyricLine[];

type SongRecord = {
  id: string;
  title: string;
  audioFilePath: string;
  songFilePath: string;
  createdAt: string;
  updatedAt: string;
};

type SongFileContent = {
  id?: string;
  title: string;
  lyrics: string;
  audioUrl: string;
  images: string[];
  song: Song;
  lines?: Song;
};
