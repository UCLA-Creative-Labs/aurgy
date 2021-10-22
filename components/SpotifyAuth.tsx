import React from 'react';
import {
  authenticate,
  SPOTIFY_CODE_VERIFIER,
  SPOTIFY_STATE,
  SPOTIFY_ACCESS_TOKEN,
  SPOTIFY_REFRESH_TOKEN,
} from '../utils';

export default function SpotifyAuth(): JSX.Element {
  const login = async () => {
    const storage = window.localStorage;
    const { state, authenticationUrl, code_verifier } = await authenticate();
    storage.setItem(SPOTIFY_STATE, state);
    storage.setItem(SPOTIFY_CODE_VERIFIER, code_verifier);
    window.open(authenticationUrl, 'Login with Spotify', 'width=800,height=600');
  };

  return (
    <button onClick={login}>Log in to Spotify</button>
  );
}

export function Logout(): JSX.Element {
  const logout = () => {
    const storage = window.localStorage;
    storage.removeItem(SPOTIFY_ACCESS_TOKEN);
    storage.removeItem(SPOTIFY_REFRESH_TOKEN);
  };

  return (
    <button onClick={logout}>Logout</button>
  );
}
