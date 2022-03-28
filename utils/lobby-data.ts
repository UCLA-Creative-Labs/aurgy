export interface ILobbyBase {
  readonly id: string;
  readonly name: string;
}

export type ILobbyUser = ILobbyBase

export interface ILobbySong extends ILobbyBase {
  readonly artists: string[];
  readonly contributors: string[];
}

export interface ILobbyDataBase extends ILobbyBase {
  readonly theme: string;
}

export interface ILobbyData extends ILobbyDataBase {
  readonly managerId: string;
  readonly managerName: string;
  readonly songs: ILobbySong[];
  readonly users: ILobbyUser[];
}

export interface ILobbiesData {
  readonly lobbies: ILobbyDataBase[];
}
