export type ITheme = string;

export type ISongData = {
  title: string;
  artist: string;
  id: string;
  embedUrl: string;
}

export type IRankingData = {
  theme: ITheme;
  song: ISongData;
}

export type IUserRanking = {
  theme: ITheme;
  songid: string;
  matches: boolean;
}

export type IUser = {
  accessToken: string;
  refreshToken: string;
  email: string;
  id: string;
  name: string;
  rankings: IUserRanking[];
}
