import { useRouter } from 'next/router';
import React, {useContext} from 'react';
import {AppContext} from '../pages/_app';
import {
  authenticate,
  SPOTIFY_CODE_VERIFIER,
  SPOTIFY_STATE,
} from '../utils';

export default function SpotifyAuth(): JSX.Element {
  const router = useRouter();
  const login = async () => {
    const storage = window.localStorage;
    const { state, authenticationUrl, code_verifier } = await authenticate();
    storage.setItem(SPOTIFY_STATE, state);
    storage.setItem(SPOTIFY_CODE_VERIFIER, code_verifier);
    void router.push(authenticationUrl);
  };

  return (
    <button onClick={login}>Log in to Spotify</button>
  );
}

export function Logout(): JSX.Element {
  const {signOut} = useContext(AppContext);

  return (
    <button onClick={signOut}>Logout</button>
  );
}
