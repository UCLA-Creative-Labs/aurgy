import { IArtist } from '../song';
import { AudioFeatures } from './audio-features';

export type TokenResponse = {
  'access_token': string,
  'refresh_token': string,
};

export type SpotifySubscriptionType = 'premium' | 'free';

export function isTokenResponse(res: any): res is TokenResponse {
  return 'access_token' in res && 'refresh_token' in res;
}

export type Image = {
  url: string,
  height: number,
  width: number,
}

export type UserInfoResponse = {
  'country': string,
  'display_name': string,
  'email': string,
  'id': string,
  'product': SpotifySubscriptionType,
  'images': Image[],
  'uri': string,
};

export function isUserInfoResponse(res: any): res is UserInfoResponse {
  return (
    'country' in res &&
    'display_name' in res &&
    'email' in res &&
    'id' in res &&
    'images' in res &&
    'product' in res &&
    'uri' in res
  );
}

export interface SongResponse{
  id: string;
  name: string;
  href: string;
  uri: string;
  popularity: number;
  duration_ms: number;
  artists: Array<IArtist>;
}

export interface TopSongResponse{
  items: SongResponse[];
}

interface AudioFeatureResponse extends AudioFeatures {
  id: string;
}

export interface AudioFeaturesResponse {
  audio_features: AudioFeatureResponse[];
}

export function isAudioFeaturesResponse(res: any): res is AudioFeaturesResponse {
  return 'audio_features' in res;
}
