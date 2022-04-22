/**
 * Spotify API Create Playlist Endpoint
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/create-playlist
 * POST /users/{user_id}/playlists
 * Body:
 * name: string
 * public: boolean
 * collaborative: boolean
 * description: string
 *
 * createSpotifyPlaylist
 * params: name
 *
 * returns the id of the newly created playlist
 */

import fetch from 'node-fetch';
import { User } from '..';

export const createSpotifyPlaylist = async (name: string): Promise<string | null> => {
  const root = await User.fromId('0');
  if (!root) return null;

  const accessToken = await root.getAccessToken();
  const userId = root.uri.split(':')[2];
  const res = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken,
      'Host': 'api.spotify.com',
    },
    body: JSON.stringify({name}),
  });

  const data = await res.json();
  if (!res.ok) return null;

  return data.id;
};
