/**
 * Spotify API Follow Playlist Endpoint
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/follow-playlist
 * PUT /playlists/{playlist_id}/followers
 * Body:
 * public: boolean
 *
 * followPlaylist
 * params: accessToken, playlist_id
 *
 * returns true if the user successfully followed the playlist
 */

import fetch from 'node-fetch';
import { User } from '..';

export const followPlaylist = async (user: User, playlistId: string): Promise<boolean> => {
  const accessToken = await user.getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken,
      'Host': 'api.spotify.com',
    },
    body: JSON.stringify({ public: false }),
  });

  return res.ok;
};
