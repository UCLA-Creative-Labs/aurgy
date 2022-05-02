export type ISongData = {
  title: string;
  artist: string;
  embedUrl: string;
}

export type IRankingData = {
  theme: string;
  song1: ISongData;
  song2: ISongData;
}
