import {Polygon} from './shapes';

export type ILobbyCreationData = {
  readonly name: string;
  readonly id: string;
}

export type ILobbiesData = {
  readonly lobbies: string[];
}

export type ILobbiesContributor = {
  name: string;
  shape: Polygon;
}

export type ILobbiesSong = {
  id: string;
  artists: string[];
  name: string;
  contributors: string[];
}

export type ILobbyData = {
  readonly name: string;
  readonly participants: string[];
  readonly theme: string;
  readonly songs: ILobbiesSong[];
};
