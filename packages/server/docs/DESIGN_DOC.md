# Aurgy Backend - Design Doc

This document was created to outline the development of the Aurgy backend service.
At a high level, it should serve as guiding principles and **not** as a source
of truth. As we learn more about the Spotify API, we will understand the limitations
of the API and combat them in an ad hoc fashion.

## Table Of Contents

* [Overview](#Overview)
* [Database Interactions](#Database-Interactions)
  * [Database Client](#Database-Client)
  * [Database Items](#Database-Items)
  * [Songs](#Songs)
  * [Users](#Users)
  * [Lobbies](#Lobbies)
* [Spotify Interactions](#Spotify-Interactions)
  * [Access Token](#Access-Token)
  * [User Info](#User-Info)
  * [User Top Songs](#User-Top-Songs)
  * [Creating Playlists](#Creating-Playlists)
  * [Mutating Playlists](#Mutating-Playlists)
  * [Deleting Playlists](#Deleting-Playlists)
  * [Following Playlists](#Following-Playlists)
* [Express Endpoints](#Express-Endpoints)
  * [POST /me](#POST-me)
  * [GET /me](#GET-me)
  * [DELETE /me](#DELETE-me)
  * [POST /lobby](#POST-lobby)
  * [GET /lobby](#GET-lobby)
  * [DELETE /lobby](#DELETE-lobby)
  * [POST /lobby/:id](#POST-lobbyid)
  * [PATCH /lobby/:id](#PATCH-lobbyid)
  * [GET /lobby/:id](#GET-lobbyid)
  * [DELETE /lobby/:id](#DELETE-lobbyid)
* [Playlist Generation](#Playlist-Generation)
  * [Themes and Audio Features](#Themes-and-Audio-Features)


## Overview

Aurgy is a web app that creates and manages group playlists surrounding a theme. 
We are going to use a variation of the **MERN** stack. For our database, we are
using **Oracle Cloud Infrastructure's Autonomous JSON Database**. **Express** is
the Javascript library we are using for our server. **Next.js** is the framework
for our frontend. And finally, **node.js** is the runtime for our express server.

To build the backend, we will focus on four main components:
* Database Interactions
* Spotify Interactions
* Express Endpoints
* Playlist Generation

This document will outline a theoretical implementation and usage of each component.

**Note**: All notation in this document should serve as a foundation for building out
the backend service. Use it to understand how the multiple components align together,
but don't constrict yourself to the implementation discussed below.

## Database Interactions

Our database service is OCI's Autonomous JSON Database (AJD). When it comes to AJD, 
there are a couple of gotchas to note.

* Install the oracle client library
* Install `node-oracledb`
* Set config path of the client library
* Get wallet and put it in the client library at `instantclient_Xx_Xx/network/admin`

### Database Client

In order to interact with the database, we will use a **client** to perform all our
read and writes. This will allow us a method to standardize our writes and prevent
inconsistencies.

In order to do so, the database client should be built as a class in the following form:

```ts
/**
 * A Client for managing database connections.
 */
export class DbClient {
  /**
   * The Oracle DB connection.
   */
  get connection(): oracledb.Connection;

  /**
   * The soda database connection for Oracle DB.
   */
  get soda(): oracledb.SodaDatabase;

  /**
   * Database collections where the key is the collection name.
   */
  public readonly collections: {[name: string]: oracledb.SodaCollection};

  /**
   * Intializes oracle client library and save password/connection string.
   */
  public constructor();

  /**
   * Configures the db client. You must run this function once.
   */
  public async configure(): Promise<void>;

  /**
   * Open a database collection given the collection name.
   *
   * @param collectionName the name of the collection
   */
  public async openCollection(collectionName: string): Promise<oracledb.SodaCollection>;

  /**
   * Query for a database item by their id and collection name.
   *
   * @param collectionName the collection to query from
   * @param id the id of the document
   * @returns the soda document associated with the query
   */
  public async findDbItem(collectionName: string, id: string): Promise<oracledb.SodaDocument | null>;

  /**
   * Write a database item into a collection
   *
   * @param items the database items to write
   */
  public async writeDbItems(...items: DbItem[]): Promise<void>;
}
```

**Note**: During development, all writes and reads will come from test collections. 

### Database Items

A database item is the building block for every object that will be inserted
into the database. Every database item must have the following attributes:
* **id**: The id of the item (this helps with querying because each collection is indexed by `id`)
* **collectionName**: The collection the item belongs to

```ts
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
  public readonly collectionName: string;

  /**
   * Check if the object exists within the database already
   * 
   * Useful for determining whether or not to insert or replace an item.
   */
  public readonly existsInDb: boolean;

  /**
   * Writes the database item to the database
   */
  public readonly writeToDatabase(): void;

  /**
   * A function that converts the object into a JSON form
   */
  public abstract toJson(): Record<string, any>;
}
```

### Songs

Songs exist as objects that will be inserted into the database. Thus, it must
extend from Database Item.

The fundamental knowledge of a song should be the following:

```ts
/**
 * The class containing a song and it's audio features
 */
export class Song extends DbItem implements ISong {
  /**
   * A static function to query for a song from its id
   *
   * @returns a song object if the id exists in the database
   */
  public static async fromId(id: string): Promise<Song | null>;

  /**
   * The id of the song
   */
  public readonly id: string;

  /**
   * The collection name for a song is 'songs'
   */
  public readonly collectionName = 'songs';

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
  public readonly artists: Artist[];

  /**
   * The song's audio features
   */
  public readonly audioFeatures: AudioFeature;
}
```

### Users

Users exist as objects that will be inserted into the database. Thus, it must
extend from Database Item.

The fundamental knowledge the User class must have is the following:

```ts
/**
 * The class containing a user and their data
 */
export class User extends DbItem implements IUser {
  /**
   * A static function to query for a user from their id
   *
   * @returns a user object if the id exists in the database
   */
  public static async fromId(id: string): Promise<User | null>;

  /**
   * The id of the user
   */
  public readonly id: string;

  /**
   * The collection name for a user is 'users'
   */
  public readonly collectionName = 'users';

  /**
   * A user's top songs
   */
  public readonly topSongs: Song[];

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
   * The lobbies the user manages
   */ 
  public readonly managedLobbies: Lobbies[];

  /**
   * The lobbies the user participates in
   */
  public readonly participatingLobbies: Lobbies[]
}
```

### Lobbies

Lobbies exist as objects that will be inserted into the database. Thus, it must
extend from Database Item.

The fundamental knowledge the Lobby class must have is the following:

```ts
/**
 * The class containing a lobby and it's data
 */
export class Lobby extends DbItem implements ILobby {
  /**
   * A static function to query for a Lobby from it's id
   *
   * @returns a lobby object if the id exists in the database
   */
  public static async fromId(id: string): Promise<Lobby | null>;

  /**
   * The id of the lobby
   */
  public readonly id: string;

  /**
   * The collection name for a lobby is 'lobbys'
   */
  public readonly collectionName = 'lobbys';

  /**
   * A user's top songs
   */
  public readonly songs: Song[];

  /**
   * The spotify id of playlist
   */
  public readonly spotifyPlaylistId: string;

  /**
   * The manager of a lobby
   */
  public readonly manager: User;

  /**
   * The participants in a lobby
   */
  public readonly participants: User[];

  /**
   * The playlist name
   */
  public readonly name: string;

  /**
   * Update the playlist based on the name and songs
   */
  public async updatePlaylist(): Promise<void>;
}
```

## Spotify Interactions

Below I detailed some spotify interactions that we will most likely need.

### Access Token

The most important thing we need is to obtain a user's access token. A user's access
token can be retrieved through their refresh token. Follow the directions in this
[article](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/)
to understand how the authorization flow works and how to refresh an auth token.

However, once an access token is created through a refresh token, the used refresh token is
then invalid. Thankfully, the response for creating an access token will always return a new
refresh token. Thus, that new refresh token must be saved into the user's table. 

### User Info

We will need basic information of a user to understand their Spotify Account type (premium/free) and their name.
This data will primarily be used for display and we probably wont perform any processing on their information.

* [User Info](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-current-users-profile)

See the written code [here](../lib/spotify/me.ts#L6)

### User's Top Songs

In order to get a user's top songs, we will utilize the following API:

* [Top songs](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks)

Note, this API allows us to extract 50 items at a time. In order to combat this, we can first call for the first
50 items. Then set the offset to 49, and extract the next 49 items (the last item in the previous query will overlap).
This leads to 99 items as data points for a given user.

See the written code [here](../lib/spotify/top-songs.ts#L24).

### Creating Playlists

Whenever we create a new lobby, we will have to also create a spotify playlist. This requires us to interact
with the Spotify API to create this playlist. This playlist should be created under the Creative Labs Spotify
account and then all users in the lobby should follow the playlist.

* [Create](https://developer.spotify.com/documentation/web-api/reference/#/operations/create-playlist)

### Mutating Playlists

Populating a playlist requires figuring out the songs that belong in the playlist. See
[playlist generation](#playlist-generation) to understand how we generate these playlists.

To update the tracks in a playlist. The simplest model would be to completely delete the playlist's tracks. And 
simply add the new track ids to the playlist. This would require two API calls:

* [Delete](https://developer.spotify.com/documentation/web-api/reference/#/operations/remove-tracks-playlist)
* [Add](https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist)

If we want to change the metadata of a playlist, we can do so with the following update call:

* [Details](https://developer.spotify.com/documentation/web-api/reference/#/operations/change-playlist-details)

### Deleting Playlists

Spotify does not have an endpoint to delete a playlist. To learn more about their decision read this
[doc](https://developer.spotify.com/documentation/general/guides/working-with-playlists/#:~:text=We%20have%20no%20endpoint%20for,you%20are%20simply%20unfollowing%20it.)

Instead, we will use the unfollow method to delete a given playlist from a user's library. 

* [Unfollow](https://developer.spotify.com/documentation/web-api/reference/#/operations/unfollow-playlist)

### Follow Playlist

Whenever a user joins/creates a lobby, they should be "subscribed" to that playlist. Since playlists are 
managed under the Creative Labs spotify account, we will use the Spotify API to make users follow the playlist.
[Documentation](https://developer.spotify.com/documentation/web-api/reference/#/operations/follow-playlist)
to follow a playlist.

Make sure to set the body parameter for `public` to false.

```json
{
  "public": false 
}
```

## Express Endpoints

In our current MVP state, our express endpoints list are small, as the interaction between client
and server is small. Below structures how the endpoints work:

| Verb   | Route                 | Description                                                         |
| ------ | --------------------- | ------------------------------------------------------------------- |
| POST   | `/me`                 | Creates an account for the user and returns the user's data         |
| GET    | `/me`                 | Login given user cookies and verifies the data aligns w/ the server |
| DELETE | `/me`                 | Removes a user's info from the database                             |
| ------ | --------------------- | ------------------------------------------------------------------- |
| POST   | `/lobby`              | Creates a new lobby and returns the lobby id w/ lobby data          |
| GET    | `/lobby`              | Returns the lobbies a user is managing and participating in         |
| ------ | --------------------- | ------------------------------------------------------------------- |
| POST   | `/lobby/:id`          | Join a lobby                                                        |
| PATCH  | `/lobby/:id`          | Update a lobbies information                                        |
| GET    | `/lobby/:id`          | Get lobby specific info                                             |
| DELETE | `/lobby/:id`          | Delete a lobby                                                      |
| DELETE | `/lobby/:id/user/:id` | Delete a user from a lobby                                          |

**Content Types**

All content types will be in the `application/json` form:

| Header Parameter | Description                        |
| ---------------- | ---------------------------------- |
| Content-Type     | Always set to `application/json`   |

**Authentication**

Authentication occurs with a JSON Web Token (JWT). JWT let's us cryptographically store the user's
id through a hash. This allows us to verify the identity of a user securely, and immediately access 
their information. See the function [`validateUserJwt`](../utils/jwt.ts#L33-L44) for more details.

| Header Parameter | Description                             |
| ---------------- | --------------------------------------- |
| Authorization    | The token for a user: `Bearer TOKEN`    |

JWT is also used to validate the lobby id that a user is trying to join. See the
function [`validateLobbyJwt`](../utils/jwt.ts#L46-56) for more details.

| Body Parameter | Description                             |
| ---------------- | --------------------------------------- |
| lobbyToken    | The token for a lobby: `TOKEN`    |

---

### POST /me

This POST request serves as a method for a user to login if there is no cookie information stored
on the client. When a user **successfully** logs in, Aurgy will send the client the user's info
that will be used to populate the client.

| Request Body Parameter | Description                        |
| ---------------------- | ---------------------------------- |
| refreshToken           | A user's refresh token             |

**Responses**
 
| Status Code | Description                        |
| ----------- | ---------------------------------- |
| 200         | A user response (detailed below)   |
| 403         | A bad refresh token                |

**User Response**

The response sent to the user if the authentication is successful.

```json
{
  "name": "string",          // The user's name
  "id": "string",            // The user's spotify id
  "accountType": "string",   // The user's spotify plan: premium or free
  "country": "string",       // The user's country code
  "images": "string[]",      // Any links to the user's images
}
```

---

### GET /me

The GET request is a method for the client to verify a user's information through the cookies stored
on the client.

| Headers         | Description                             |
| --------------- | --------------------------------------- |
| Authorization   | The token for a user: `Bearer TOKEN`    |

**Responses**

| Status Code | Description                                   |
| ----------- | --------------------------------------------- |
| 200         | A user response (detailed below)              |
| 401         | Token is not present in headers               |
| 403         | Token does not pass verification (expired)    |
| 404         | User is not found in database                 |

**User Response**

The response sent to the user if the authentication is successful.

```json
{
  "name": "string",          // The user's name
  "id": "string",            // The user's spotify id
  "accountType": "string",   // The user's spotify plan: premium or free
  "country": "string",       // The user's country code
  "images": "string[]",      // Any links to the user's images
}
```

---

### DELETE /me

The DELETE request is a method for the client to delete their account. This will result in the entire
entry for the user to be deleted.

| Headers         | Description                             |
| --------------- | --------------------------------------- |
| Authorization   | The token for a user: `Bearer TOKEN`    |

**Responses**

| Status Code | Description                                       |
| ----------- | ------------------------------------------------- |
| 200         | User has been succesfully deleted from database   |
| 401         | Token is not present in headers               |
| 403         | Token does not pass verification (expired)    |
| 404         | User is not found in database                     |

---

### POST /lobby

The POST request for `/lobby` serves as a way to create a lobby. Aurgy will then
return the lobby information. In order to understand who is making the request,
we will be sending both the id and the refresh token of the user.

| Headers         | Description                             |
| --------------- | --------------------------------------- |
| Authorization   | The token for a user: `Bearer TOKEN`    |

| Request Body Parameter | Description                        |
| ---------------------- | ---------------------------------- |
| lobbyName              | The name of the lobby              |
| theme                  | The theme of the lobby             |

**Responses**

| Status Code | Description                                                                         |
| ----------- | ----------------------------------------------------------------------------------- |
| 200         | User has been succesfully deleted from database                                     |
| 401         | Token is not present in headers                                                     |
| 403         | Token does not pass verification (expired)                                          |
| 404         | User is not found in database                                                       |
| 406         | User has exceeded their lobby count, the name is invalid, or the theme is invalid   | 

**Lobby Response**

The response sent to the user regarding the lobby information.

```json
{
  "name": "string",      // The lobby name
  "id": "string",        // The lobby id
}
```

---

### GET /lobby

The GET request for `/lobby` is a way for the user to get what lobbies they are in.

| Headers         | Description                             |
| --------------- | --------------------------------------- |
| Authorization   | The token for a user: `Bearer TOKEN`    |

**Responses**

| Status Code | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| 200         | User has been authenticated and returns the lobbies response   |
| 401         | Token is not present in headers                                |
| 403         | Token does not pass verification (expired)                     |
| 404         | User is not found in database                                  |

---

### POST /lobby/:id

The POST request for `/lobby/:id` is a way for a user to join a lobby.

Verification happens in two stages:
1. User verification: make sure the user is valid
2. Lobby token verification: Make sure the lobby token to join the lobby is valid (not expired)

| Headers         | Description                             |
| --------------- | --------------------------------------- |
| Authorization   | The token for a user: `Bearer TOKEN`    |

| Request Body Parameter | Description                            |
| ---------------------- | -------------------------------------- |
| lobbyToken             | The expirable token to verify a lobby  |

**Responses**

| Status Code | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| 200         | User has been added to the lobby and the lobby info is sent    |
| 401         | Token is not present in headers                                |
| 403         | Token does not pass verification (expired)                     |
| 404         | User is not found in database                                  |
| 406         | The lobby token is invalid                                     |

---

### GET /lobby/:id

The GET request for `/lobby/:id` is a way for a user to get lobby info. It might be a good idea
to turn this into a websocket. That way updates to the lobby when a user is on the page is updated
on the client in real time. We can investigate this solution at a later day.

Verification happens in two stages:
1. User verification: make sure the user is valid
2. Lobby Status: Make sure the user is part of the lobby

| Headers         | Description                             |
| --------------- | --------------------------------------- |
| Authorization   | The token for a user: `Bearer TOKEN`    |

**Responses**

| Status Code | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| 200         | User is in lobby and the lobby data is sent to the user        |
| 401         | Token is not present in headers                                |
| 403         | Token does not pass verification (expired)                     |
| 404         | User is not found in database                                  |
| 406         | User is not part of the lobby                                  |

---

### PATCH /lobby/:id

The PATCH request for `/lobby/:id` is a way for a user to update lobby information.

Verification happens in two stages:
1. User verification: make sure the user is valid
2. Lobby Permissions: Make sure the user is the manager of the lobby

| Headers         | Description                             |
| --------------- | --------------------------------------- |
| Authorization   | The token for a user: `Bearer TOKEN`    |

| Request Body Parameter | Description                            |
| ---------------------- | -------------------------------------- |
| name                   | The lobby name you want                |

**Responses**

| Status Code | Description                                         |
| ----------- | --------------------------------------------------- |
| 200         | Lobby has been succesfully updated from database    |
| 401         | Token is not present in headers                     |
| 403         | Token does not pass verification (expired)          |
| 404         | User is not found in database                       |
| 406         | User is not a manager of the lobby                  |

---

### DELETE /lobby/:id

The DELETE request for `/lobby/:id` is a way for a user to delete a lobby.

Verification happens in two stages:
1. User verification: make sure the user is valid
2. Lobby Permissions: Make sure the user is the manager of the lobby

| Headers         | Description                             |
| --------------- | --------------------------------------- |
| Authorization   | The token for a user: `Bearer TOKEN`    |

**Responses**

| Status Code | Description                                         |
| ----------- | --------------------------------------------------- |
| 200         | Lobby has been succesfully deleted from database    |
| 401         | Token is not present in headers                     |
| 403         | Token does not pass verification (expired)          |
| 404         | User is not found in database                       |
| 406         | User is not a manager of the lobby                  |

---

### DELETE /lobby/:id/user:id

The DELETE request for `/lobby/:id/user/:id` is a way for the manager of a 
lobby to remove another user from the lobby.

Verification happens in two stages:
1. User verification: make sure the user is valid
2. Lobby Permissions: Make sure the user is the manager of the lobby

| Headers         | Description                             |
| --------------- | --------------------------------------- |
| Authorization   | The token for a user: `Bearer TOKEN`    |

**Responses**

| Status Code | Description                                         |
| ----------- | --------------------------------------------------- |
| 200         | Lobby has been succesfully deleted from database    |
| 401         | Token is not present in headers                     |
| 403         | Token does not pass verification (expired)          |
| 404         | User is not found in database                       |
| 406         | User is not a manager of the lobby                  |

## Playlist Generation

Playlist generation is a core part of how Aurgy will function. Thankfully, this component is
internal to the backend and can be adjusted without much affect on the user interface or
general user interactions.

### Themes and Audio Features

To start off, we will have 1 theme. This theme will consist of something distinct enough so that
interpretation is not that broad. For example, `road trip` can mean chill, acoustic music to some
people or upbeat, pop to others. In which case, we should lean towards one over the other with
something like: `disassociating on the highway`. 

Once a theme is picked, we then need to define the audio features that comprise the theme. This work
becomes a lot more trial and error but the general model should be the following:
  * **min**: the minimum value a song's audio feature must have to qualify
  * **max**: the maximum value a song's audio feature must have to qualify
  * **target**: the target value for the theme
  * **weight**: the weight attached to a given audio feature for a theme

We can then start off with general points and potentially have people on board help us test combinations 
and rate how close a playlist relates to the theme.

### Simple Algorithm

The general algorithm consists of the following steps:

* Every lobby has a theme, this theme will have a set of audio features
(dancebility, valence, etc.). These audio features will have a min, max, target and weights
* For every user in a lobby, map through all their songs and first check if the song
qualifies. If the song qualifies, calculate the closeness score.

> <img src="https://latex.codecogs.com/svg.image?closeness&space;=&space;(1&space;-&space;(target_{feature}&space;-&space;song_{feature})&space;*&space;weight" title="closeness = (1 - (target_{feature} - song_{feature}) * weight"/>

* Store the songs into a map, mapping the song id to the closeness score and number of users
* Assign a higher priority to songs with multiple users contributing
* Select the top 50 songs from all qualifying songs

### Recommendation API

In order to fill empty space in a playlist, we can utilize the recommendation
API to get additional songs. We would need to seed the query with our current
songs and target audio features but this method allows us to give the user new
songs. 

* [Recommendation](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recommendations)

