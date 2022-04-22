import fetch from 'node-fetch';
import { TokenResponse } from '.';
import { objectToForm } from '../../utils';
import { HTTPResponseError } from '../../utils/errors';
import {CLIENT_ID} from '../private/CONSTANTS';
import {TOKEN} from '../private/SPOTIFY_ENDPOINTS';
import { isTokenResponse } from './types';

/**
 * Get a new access token, from a refresh token.
 *
 * **Note:** the refresh token will then become invalid.
 *
 * @param refreshToken the refresh token to generate an access token
 * @returns the token response with an updated refresh token
 */
export async function getAccessToken(refreshToken: string): Promise<TokenResponse> {
  const body = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
  };

  const res = await fetch(TOKEN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: objectToForm(body),
  });

  if (!res.ok) {
    throw new HTTPResponseError(res);
  }

  const data = await res.json();

  if (!isTokenResponse(data)) {
    throw new Error('Error: Response from Spotify not in token response form');
  }

  return data;
}
