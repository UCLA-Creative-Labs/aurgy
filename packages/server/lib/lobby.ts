import { getClient, Song, SongMetadata, updateSongs, User, UserMetadata } from '.';
import { kLargest } from '../utils';
import { DbItem, IDbItem } from './db-item';
import { compareSongScores, computeScore, Song2Score } from './playlist-generation/compute-score';
import { THEME } from './playlist-generation/themes';
import { COLLECTION } from './private/enums';
import { createSpotifyPlaylist } from './spotify/create-playlist';

type DatabaseEntry = Omit<ILobby, 'collectionName' | 'key'>;
type ClientResponse = {
  theme: THEME;
  name: string;
  songs: SongMetadata[];
  users: UserMetadata[];
  managerId: string,
  managerName: string,
}
export interface LobbyMetadata {
  id: string,
  name: string,
  theme: THEME,
}
export interface LobbyCreateProps {
  /**
    * The manager of a lobby
    */
  readonly manager: User;

  /**
   * The theme of a lobby
   */
  readonly theme: THEME;

  /**
    * The playlist name
    */
  readonly name: string;
}
export interface LobbyProps extends Omit<LobbyCreateProps, 'manager'> {
  /**
   * The participants in a lobby
   */
  readonly participants?: string[];

  /**
   * The list of song ids in the playlist
   */
  readonly songIds?: string[];

  /**
   * The manager of a lobby
   */
  readonly managerId: string;

  /**
   * The manager of a lobby's name
   */
  readonly managerName: string;

  /**
   * Metadata regarding the songs in the playlist
   */
  readonly songMetadata?: SongMetadata[];

  /**
   * Metadata regarding the users in the lobby
   */
  readonly userMetadata?: UserMetadata[];
}

export interface ILobby extends Omit<LobbyProps, 'particapnts' | 'songIds' | 'songMetadata' | 'userMetadata'>, IDbItem {
}

/**
 * The class containing a user and their data
 */
export class Lobby extends DbItem implements ILobby {
  /**
   * A static function to get all the lobby in the database
   *
   * @returns all lobby in the lobby collection
   */
  public static async all(): Promise<Lobby[]> {
    const client = await getClient();
    const docs = await client.getCollectionItems(COLLECTION.LOBBIES);
    return await Promise.all(docs.map(doc => {
      const content = doc.getContent();
      return new Lobby(content.id, content as DatabaseEntry, content.key);
    }));
  }

  /**
   * A static function to query for a Lobby from its id
   *
   * @returns a Lobby object if the id exists in the database
   */
  public static async fromId(id: string): Promise<Lobby | null> {
    const client = await getClient();
    const document = await client.findDbItem(COLLECTION.LOBBIES, id);
    if (!document) return null;
    const content = document.getContent();
    return new Lobby(id, content as DatabaseEntry, document.key ?? null);
  }

  /**
   * A static function to create a new Lobby and corresponding Spotify playlist
   *
   * @returns a newly created Lobby object
   */
  public static async create(props: LobbyCreateProps, key : string | null = null) : Promise<Lobby | null> {
    const manager = props.manager;
    const playlistId = await createSpotifyPlaylist(props.name);
    if (!playlistId) return null;
    const newLobby = new Lobby(playlistId, {...props, managerId: manager.id, managerName: manager.name}, key);
    const added = manager.addLobby(newLobby);
    if (!added) return null;
    return newLobby;
  }

  /**
   * The manager user id of a lobby
   */
  public readonly managerId: string;

  /**
   * The manager name of a lobby
   */
  public readonly managerName: string;

  /**
   * The theme of a lobby
   */
  public readonly theme: THEME;

  /**
   * The playlist name
   */
  get name(): string {
    return this.#name;
  }
  #name: string;

  private songMetadata: SongMetadata[];

  private userMetadata: UserMetadata[];

  protected constructor(playlistId: string, props: LobbyProps, key: string | null = null) {
    super(playlistId, COLLECTION.LOBBIES, key);
    this.managerId = props.managerId;
    this.managerName = props.managerName;
    this.theme = props.theme;
    this.#name = props.name;
    this.songMetadata = props.songMetadata ?? [];
    this.userMetadata = props.userMetadata ?? [{id: props.managerId, name: props.managerName}];
  }

  /**
   * Converts the object into a form for the database
   * @returns a database entry
   */
  public toJson(): DatabaseEntry {
    const {collectionName: _c, ...entry} = this;
    return { ...entry, name: this.name};
  }

  /**
   * Add a user to the lobby
   */
  public async addUser(user: User, writeToDb = true): Promise<boolean> {
    this.userMetadata.push({id: user.id, name: user.name});
    const added = await user.addLobby(this);
    if (!added) return false;
    void this.synthesizePlaylist();
    writeToDb && void this.writeToDatabase();
    return added;
  }

  /**
   * Removes a user from the lobby
   */
  public async removeUser(user: User, writeToDb = true): Promise<boolean> {
    const removeUserId = user.id;
    if (removeUserId === this.managerId || !this.containsParticipant(removeUserId)) return false;
    this.userMetadata = this.userMetadata.filter(userObj => userObj.id !== removeUserId);
    const removed = await user.removeLobby(this);
    if (!removed) return false;
    writeToDb && void this.writeToDatabase();
    return removed;
  }

  /**
   * Update lobby name
   */
  public async updateName(name: string, writeToDatabase = true): Promise<void> {
    this.#name = name;
    writeToDatabase && void this.writeToDatabase();
  }

  /**
   * Synthesize playlist
   */
  public async synthesizePlaylist(writeToDatabase = true): Promise<boolean> {
    const songsMap = await this.userMetadata.reduce(async (accP: Promise<Record<string, string[]>>, userObj) => {
      const acc = await accP;

      const userId = userObj.id;
      const user = await User.fromId(userId);
      if (!user) return acc;

      user.topSongs.forEach((songId) => {
        if (!acc[songId]) acc[songId] = [];
        acc[songId].push(user.name);
      });

      return acc;
    }, Promise.resolve({}));

    const songScores: Song2Score[] = await Object.entries(songsMap).
      reduce(async (accP: Promise<Song2Score[]>, [id, contributors]) => {
        const acc = await accP;
        const song = await Song.fromId(id);
        if (!song || !song.audioFeatures) return acc;
        const score = computeScore(song.audioFeatures, this.theme) * (1 + contributors.length * .1);
        if (score === 0) return acc;
        acc.push({song, score});
        return acc;
      }, Promise.resolve([]));

    const topSongs = kLargest<Song2Score>(songScores, compareSongScores, 50);
    const isPlaylistUpdated = await updateSongs(this.id, ...topSongs.map(s => s.song.uri));

    if (!isPlaylistUpdated) return false;

    this.songMetadata = topSongs.map(s => ({
      id: s.song.id,
      name: s.song.name,
      artists: s.song.artists.map(a => a.name),
      contributors: songsMap[s.song.id],
    }));

    writeToDatabase && void this.writeToDatabase();

    return true;
  }

  /**
   * Formats the data in a client friendly manner
   *
   * @returns return a client response
   */
  public getClientResponse(): ClientResponse {
    return {
      name: this.name,
      theme: this.theme,
      songs: this.songMetadata,
      users: this.userMetadata,
      managerId: this.managerId,
      managerName: this.managerName,
    };
  }

  /**
   * Determines is a User is in the Lobby
   */
  public containsParticipant(user: string | User): boolean {
    const userId = typeof user == 'string' ? user : user.id;
    return !!this.userMetadata.find((userObj) => userObj.id === userId);
  }
}
