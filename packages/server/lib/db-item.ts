import oracledb from 'oracledb';
import { getClient } from './db-client';
import { COLLECTION } from './private/enums';

/**
 * The interface for a database item
 */
export interface IDbItem {
  readonly id: string;
  readonly collectionName: string;
  readonly key: string | null;
}

/**
 * A database item. All database items should extend this class.
 */
export abstract class DbItem implements IDbItem {
  /**
   * The id of the item in a collection
   */
  public readonly id: string;

  /**
   * The collection this database item belongs to
   */
  public readonly collectionName: COLLECTION;

  /**
   * The key of the soda document.
   *
   * This property will only exist if the object lives in
   * the database.
   */
  get key (): string | null {
    return this.#key;
  }

  #key: string | null;

  constructor(id: string, collectionName: COLLECTION, _key: string | null = null) {
    this.id = id;
    this.collectionName = collectionName;
    this.#key = _key;
  }

  /**
   * Writes this database item to the database
   */
  public async writeToDatabase(): Promise<void> {
    const client = await getClient();
    return client.writeDbItems(this);
  }

  /**
   * Remove this database item from the database
   */
  public async removeFromDatabase(): Promise<oracledb.SodaRemoveResult> {
    const client = await getClient();
    return client.deleteDbItem(this);
  }

  /**
   * Convert the class into a JSON object for storage
   */
  public abstract toJson(): Record<string, any>;
}
