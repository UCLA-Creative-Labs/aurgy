import { useRouter } from 'next/router';
import React, {useContext, useEffect} from 'react';
import {AppContext} from '../pages/_app';
import {
  getUrlPath,
  SPOTIFY_STATE,
  fetchSpotifyTokens,
} from '../utils';

export default function SpotifyCallback(): JSX.Element {
  const {setAccessToken, setRefreshToken} = useContext(AppContext);
  const router = useRouter();
  useEffect(() => {
    const {code, state} = router.query;
    const storage = window.localStorage;
    if (!code || !state || state !== storage.getItem(SPOTIFY_STATE)) return;
    const redirect = async () => {
      const {accessToken, refreshToken} = await fetchSpotifyTokens(code, storage);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      void router.push(getUrlPath());
    };
    void redirect();
  }, [router]);

  return (
    <div>You will be rerouted shortly!</div>
  );
}
