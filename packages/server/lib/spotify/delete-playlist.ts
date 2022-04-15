/**
 * Spotify API Unfollow Playlist Endpoint
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/unfollow-playlist
 * DELETE /playlists/{playlist_id}/followers
 *
 * deleteSpotifyPlaylist
 * params: playlistId
 *
 * returns whether the playlist was successfully deleted
 */

import fetch from 'node-fetch';
import { User } from '..';

export const deleteSpotifyPlaylist = async (playlistId: string): Promise<boolean | null> => {
  const root = await User.fromId('0');
  if (!root) return false;

  const accessToken = await root.getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken,
      'Host': 'api.spotify.com',
    },
  });

  return res.ok;
};
