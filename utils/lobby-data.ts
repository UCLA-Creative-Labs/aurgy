export type ILobbyCreationData = {
  readonly name: string;
  readonly id: string;
}

export type ILobbiesData = {
  readonly lobbies: string[];
}

export type ILobbyData = {
  readonly id: string;
  readonly managerId: string;
  readonly name: string;
  readonly participants: string[];
  readonly theme: string;
};
