import oracledb from 'oracledb';
import {DbClient, getClient} from '../../lib';

jest.mock('oracledb');

describe('Database Client', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('initializes oracle client and env variables on construction', async () => {
    // GIVEN
    const client = new DbClient();

    // WHEN
    const configure = async () => await client.configure();

    // THEN
    expect(oracledb.autoCommit).toBe(true);
    expect(oracledb.initOracleClient).toBeCalledTimes(1);
    expect(configure).not.toThrow();
  });

  test('only configures once', async () => {
    // GIVEN
    await getClient();

    // THEN
    expect(oracledb.getConnection).toBeCalledTimes(1);
  });

  test('errors when grabbing connection and not configured', () => {
    // GIVEN
    const client = new DbClient();

    // WHEN
    const accessConnection = () => client.connection;

    // THEN
    expect(accessConnection).toThrowError(
      'DbClient is not connected to Oracle JSON Database. ' +
      'Make sure you configure the client with DbClient.configure().',
    );
  });

  test('errors when grabbing soda and not configured', () => {
    // GIVEN
    const client = new DbClient();

    // WHEN
    const accessSoda = () => client.soda;

    // THEN
    expect(accessSoda).toThrowError(
      'SODA is not configured on DbClient. ' +
      'Make sure you configure the client with DbClient.configure().',
    );
  });

  test('returns the same client on subsequent getClient calls', async () => {
    // GIVEN
    const oldClient = await getClient();

    // WHEN
    const newClient = await getClient();

    // THEN
    expect(newClient).toBe(oldClient);
  });
});
