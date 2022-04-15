/**
 * Spotify API Unfollow Playlist Endpoint
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/unfollow-playlist
 * DELETE /playlists/{playlist_id}/followers
 *
 * unfollowPlaylist
 * params: accessToken, playlist_id
 *
 * returns true if the user successfully unfollowed the playlist
 */

import fetch from 'node-fetch';
import { User } from '..';

export const unfollowPlaylist = async (user: User, playlistId: string): Promise<boolean> => {
  const accessToken = await user.getAccessToken();

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
