import fetch from 'node-fetch';
import { HTTPResponseError } from '../../utils/errors';
import {ME} from '../private/SPOTIFY_ENDPOINTS';
import { isUserInfoResponse, UserInfoResponse } from './types';

export async function getMeInfo(accessToken: string): Promise<UserInfoResponse> {
  const res = await fetch(ME, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new HTTPResponseError(res);
  }

  const data = await res.json();

  if (!isUserInfoResponse(data)) {
    throw new Error('Error: Response from spotify is not in user info response form.');
  }

  return data;
}
