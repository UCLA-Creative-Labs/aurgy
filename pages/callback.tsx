import { useRouter } from 'next/dist/client/router';
import React, {useEffect} from 'react';
import {SPOTIFY_STATE, windowCallback} from '../utils';

export default function SpotifyCallback(): JSX.Element {
  const router = useRouter();
  useEffect(() => {
    const {code, state} = router.query;
    const storage = window.localStorage;
    if (!code || !state || state !== storage.getItem(SPOTIFY_STATE)) return;
    void windowCallback(code, storage);
  }, [router]);

  return (
    <div>You will be rerouted shortly!</div>
  );
}
