import fetch from 'node-fetch';
import { User } from '..';

/**
 * Spotify Update Items In Playlist
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/reorder-or-replace-playlists-tracks
 *
 * Update items in a playlist
 */
export async function updateSongs(playlistId: string, ...uris: string[]): Promise<boolean> {
  const root = await User.fromId('0');
  if (!root) return false;

  const accessToken = await root.getAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({uris}),
  });

  return res.ok;
}
