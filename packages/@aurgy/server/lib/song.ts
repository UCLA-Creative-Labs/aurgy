import { getClient } from '.';
import { DbItem, IDbItem } from './db-item';
import { COLLECTION } from './private/enums';
import { AudioFeatures } from './spotify/audio-features';

export interface SongMetadata {
  readonly id: string;
  readonly name: string;
  readonly artists: string[];
  readonly contributors: string[];
}

type DatabaseEntry = Omit<ISong, 'collectionName' | 'key'>;

export interface IArtist{
  id: string;
  uri: string;
  name: string;
}

export interface SongProps {
  /**
   * The song name
   */
  readonly name: string;
  /**
   * The song's uniform resource identifier
   */
  readonly uri: string;
  /**
   * The song's duration in milliseconds
   */
  readonly duration: number;
  /**
   * The song's popularity
   */
  readonly popularity?: number;
  /**
   * A list of artists for the song
   */
  readonly artists: IArtist[];
  /**
   * The song's audio features
   */
  readonly audioFeatures?: AudioFeatures;
}


export interface ISong extends SongProps, IDbItem {}

/**
 * The class containing a song and it's audio features
 */
export class Song extends DbItem implements ISong {
  /**
   * A static function to get all the songs in the database
   *
   * @returns all songs in the song collection
   */
  public static async all(): Promise<Song[]> {
    const client = await getClient();
    const docs = await client.getCollectionItems(COLLECTION.SONGS);
    return await Promise.all(docs.map(doc => {
      const content = doc.getContent();
      return new Song(content.id, content as DatabaseEntry, content.key);
    }));
  }

  /**
   * A static function to query for a song from its id
   *
   * @returns a song object if the id exists in the database
   */
  public static async fromId(id: string): Promise<Song | null> {
    const client = await getClient();
    const document = await client.findDbItem(COLLECTION.SONGS, id);
    if (!document) return null;
    const content = document.data();
    if (!content) return null;
    return new Song(id, content as DatabaseEntry, document.key ?? null);
  }

  /**
   * The song name
   */
  public readonly name: string;

  /**
   * The song's uniform resource identifier
   */
  public readonly uri: string;

  /**
   * The song's duration in milliseconds
   */
  public readonly duration: number;

  /**
   * The song's popularity.. why not?
   */
  public readonly popularity?: number;

  /**
   * A list of artists for the song
   *
   * ```json
   * {
   *   id: string
   *   uri: string
   *   name: string
   * }
   * ```
   */
  public readonly artists: IArtist[];

  /**
   * The song's audio features
   */
  get audioFeatures(): AudioFeatures | undefined {
    return this.#audioFeatures;
  }

  #audioFeatures: AudioFeatures | undefined;

  constructor(id: string, props: SongProps, key: string | null = null) {
    super(id, COLLECTION.SONGS, key);
    this.name = props.name;
    this.uri = props.uri;
    this.duration = props.duration;
    this.popularity = props.popularity;
    this.artists = props.artists;
    this.#audioFeatures = props.audioFeatures;
  }

  /**
   * Converts the object into a form for the database
   * @returns a database entry
   */
  public toJson(): DatabaseEntry {
    const {collectionName: _c, ...entry} = this;
    return {...entry, audioFeatures: this.audioFeatures};
  }

  /**
   * Update this Song's audio features.
   *
   * @param af the audio features for the song
   * @param writeToDatabase flag to write the song to the database (default: true)
   */
  public updateAudioFeatures(af: AudioFeatures, writeToDatabase = true): void {
    this.#audioFeatures = af;
    if(writeToDatabase) void this.writeToDatabase();
  }
}
