import { getAccessToken, getClient, SpotifySubscriptionType } from '.';
import { DbItem, IDbItem } from './db-item';
import { Lobby, LobbyMetadata } from './lobby';
import { COLLECTION } from './private/enums';
import { followPlaylist } from './spotify/follow-playlist';
import { getTopSongs } from './spotify/top-songs';
import { unfollowPlaylist } from './spotify/unfollow-playlist';

type DatabaseEntry = Omit<IUser, 'collectionName' | 'key'>;

type ClientResponse = Omit<DatabaseEntry, 'uri' | 'topSongs' | 'refreshToken'>;

export interface UserMetadata {
  readonly id: string;
  readonly name: string;
}

export interface UserProps {
  /**
   * The refresh token for the user
   */
  readonly refreshToken: string;

  /**
   * A user's top songs
   */
  readonly topSongs?: string[];

  /**
  * The user's spotify subscription type: premium/free
  */
  readonly accountType: SpotifySubscriptionType;

  /**
  * The user's name
  */
  readonly name: string;

  /**
  * The user's uniform resource identifier
  */
  readonly uri: string;

  /**
  * The user's profile images
  */
  readonly images: string[];

  /**
  * The user's country
  */
  readonly country: string;

  /**
   * A user's lobbies
   */
  readonly lobbies?: LobbyMetadata[];
}

export interface IUser extends Omit<UserProps, 'topSongs'>, IDbItem {
  /**
   * A user's top songs
   */
  readonly topSongs: string[];

  /**
   * A user's lobbies
   */
  readonly lobbies: LobbyMetadata[];
}

/**
 * The class containing a user and their data
 */
export class User extends DbItem implements IUser {
  /**
   * A static function to query for a user from their id
   *
   * @returns a user object if the id exists in the database
   */
  public static async fromId(id: string): Promise<User | null> {
    const client = await getClient();
    const document = await client.findDbItem(COLLECTION.USERS, id);
    if (!document) return null;
    const content = document.getContent();
    return new User(id, content as DatabaseEntry, document.key ?? null);
  }

  /**
   * The user's spotify subscription type: premium/free
   */
  public readonly accountType: SpotifySubscriptionType;

  /**
  * The user's name
  */
  public readonly name: string;

  /**
  * The user's uniform resource identifier
  */
  public readonly uri: string;

  /**
  * The user's profile images
  */
  public readonly images: string[];

  /**
  * The user's country
  */
  public readonly country: string;

  /**
    * A user's top songs
    */
  get topSongs(): string[] {
    return this.#topSongs;
  }

  #topSongs: string[];

  get lobbies(): LobbyMetadata[] {
    return this.#lobbies;
  }

  #lobbies: LobbyMetadata[];

  /**
  * The refresh token for the user
  */
  get refreshToken(): string {
    return this.#refreshToken;
  }

  #refreshToken: string;

  constructor(id: string, props: UserProps, key: string | null = null) {
    super(id, COLLECTION.USERS, key);
    this.#refreshToken = props.refreshToken;
    this.#topSongs = props.topSongs ?? [];
    this.#lobbies = props.lobbies ?? [];
    this.name = props.name;
    this.accountType = props.accountType;
    this.uri = props.uri;
    this.images = props.images;
    this.country = props.country;
  }

  /**
   * Converts the object into a form for the database
   * @returns a database entry
   */
  public toJson(): DatabaseEntry {
    const {collectionName: _c, ...entry} = this;
    return {
      ...entry,
      refreshToken: this.refreshToken,
      topSongs: this.topSongs,
      lobbies: this.lobbies,
    };
  }

  /**
   * Add a lobby to the user's lobby list
   */
  public async addLobby(lobby: Lobby, writeToDatabase = true): Promise<boolean> {
    this.#lobbies.push({id: lobby.id, name: lobby.name, theme: lobby.theme});
    if (writeToDatabase) void this.writeToDatabase();
    const addedToPlaylist = await followPlaylist(this, lobby.id);
    return addedToPlaylist;
  }

  /**
   * Remove a lobby from the user's lobby list
   */
  public async removeLobby(lobby: Lobby, writeToDatabase = true): Promise<boolean> {
    this.#lobbies = this.#lobbies.filter(lobbyObj => lobbyObj.id !== lobby.id);
    if (writeToDatabase) void this.writeToDatabase();
    const removedFromPlaylist = await unfollowPlaylist(this, lobby.id);
    return removedFromPlaylist;
  }

  /**
   * Updates a user's top songs
   */
  public async updateTopSongs(writeToDatabase = true): Promise<void> {
    const accessToken = await this.getAccessToken(false);
    const topSongs = await getTopSongs(accessToken);
    this.#topSongs = Object.keys(topSongs);
    if (writeToDatabase) void this.writeToDatabase();
  }

  /**
   * Update the refresh token in the database
   *
   * @param refreshToken the refresh token to update
   */
  public updateRefreshToken(refreshToken: string, writeToDatabase = true): void {
    this.#refreshToken = refreshToken;
    if(writeToDatabase) void this.writeToDatabase();
  }

  /**
   * Return a new access token to use. This function will also update
   * the user's refresh token.
   *
   * @returns a new access token for the user
   */
  public async getAccessToken(writeToDatabase = true): Promise<string> {
    const tokens = await getAccessToken(this.refreshToken);
    this.updateRefreshToken(tokens.refresh_token, writeToDatabase);
    return tokens.access_token;
  }

  /**
   * Formats the data in a client friendly manner
   *
   * @returns return a client response
   */
  public getClientResponse(): ClientResponse {
    const {collectionName: _c, uri: _u, ...response} = this;
    return {...response, lobbies: this.lobbies};
  }
}
