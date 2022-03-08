export type ILobbyCreationData = {
  readonly name: string;
  readonly id: string;
}

export type ILobbySong = {
  id: string;
  artists: string[];
  name: string;
  contributors: string[];
}

export type ILobbyUser = {
  id: string,
  name: string,
}

export type ILobbyDataShort = {
  readonly id: string;
  readonly name: string;
  readonly theme: string;
}

export type ILobbiesData = {
  readonly lobbies: ILobbyDataShort[];
}

export type ILobbyDataFull = {
  readonly name: string;
  readonly theme: string;
  readonly managerId: string;
  readonly managerName: string;
  readonly songs: ILobbySong[];
  readonly users: ILobbyUser[];
};
