interface ConnectionProps {
  readonly user: string;
  readonly password: string;
  readonly connectionString: string;
}

const oracledb = jest.fn().mockImplementation(() => {
  return {
    initOracleClient: (_props: any) => undefined,
    getConnection: jest.fn(async ({user, password, connectionString}: ConnectionProps) => {
      if (user !== 'admin')
        throw new Error(`Incorrect user, received: ${user}`);
      if (password !== 'SUPER SECRET PASSWORD')
        throw new Error(`Incorrect Password, received: ${password}`);
      if (connectionString !== 'CONNECTION_STRING_123')
        throw new Error(`Incorrect Connection String, received: ${connectionString}`);
      
      return {
        getSodaDatabase: async () => undefined,
      };
    }),
  };
});

export default oracledb();