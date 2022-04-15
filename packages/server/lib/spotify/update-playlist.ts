/**
 * Spotify API Update Playlist Endpoint
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/change-playlist-details
 * PUT /playlists/{playlist_id}
 *
 * updateSpotifyPlaylist
 * params: playlistId, playlistName
 *
 * returns whether the playlist was successfully updated
 */

import fetch from 'node-fetch';
import { User } from '..';

export const updateSpotifyPlaylist = async (playlistId: string, playlistName: string): Promise<boolean | null> => {
  const root = await User.fromId('0');
  if (!root) return false;

  const accessToken = await root.getAccessToken();
  const bodyParams = {
    name: playlistName,
  };
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken,
      'Host': 'api.spotify.com',
    },
    body: JSON.stringify(bodyParams),
  });
  return res.ok;
};
