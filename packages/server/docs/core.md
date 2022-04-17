# Aurgy Backend - Core

The `/lib/` directory contains all the core logic required to run Aurgy. This
includes the following: any spotify logic, any oracle database logic, any logic
used to process endpoint requests.

## Database Client

In order to easily interact with the database, we created a class to act as a 
client to simplify database interactions.

### Requirements

In order for the database client to function properly, you need 3 key components:

* Oracle Client Library unzipped and installed to the `configDir` location
* The environment variable PASSWORD set to the database password
* The environemnet variable CONNECTION_STRING set to the connection string for
the database

The easiest way to ensure the latter half is something like the following:

```sh
PASSWORD="DB_PASSWORD" CONNECTION_STRING="CONNECTION_STRING_123" <start command here>

# i.e.
PASSWORD="DB_PASSWORD" CONNECTION_STRING="CONNECTION_STRING_123" yarn dev
```

### Initialization

When it comes to using the client, the easiest way to use it is with the `getClient`
call.

```ts
const client = await getClient();
```

`getClient` will return the same database client on subsequent calls and amortizes 
configuration and opening collections.

### Opening collections

To open a collection, run the following:

```ts
const client = await getClient();
const collection = await client.openCollection(collectionName);
```

## Spotify

All of our spotify logic is implemented in a `functional` paradigm. Why? Any spotify
logic we have is state agnostic. In many ways, the spotify logic we are creating are
abstractions of the Spotify API.

### Creating a Spotify Abstraction

When it comes to interacting with the Spotify API, the workflow should look like the
following:

1. Create an entry in `./lib/private/SPOTIFY_ENDPOINTS.ts` for the endpoint you are 
querying
2. Create a type and validator for the response from the endpoint.
3. Create the logic to perform the query

```ts
function async getSpotifyInfo(...parameters: any[]): Promise<any> {
  // Fetch info
  const res = await fetch(ENDPOINT, { ... });

  // Check if response is valid
  if (!res.ok) {
    throw new HttpResponseError(res);
  }

  // Extract the data
  const data = await res.json();

  // Validate the data has the right info
  if (!isSpotifyInfoResponse(data)) {
    throw new Error(...);
  }

  // Perform your logic and simplification
  const cleanData = logic(data);

  // Return cleaned data
  return cleanData;
}

```