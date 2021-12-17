import { useRouter } from 'next/router';
import React, {useContext, useEffect} from 'react';
import Layout from '../components/Layout';
import {AppContext} from '../pages/_app';
import {
  getUrlPath,
  SPOTIFY_STATE,
  fetchSpotifyTokens,
} from '../utils';

export default function SpotifyCallback(): React.ReactNode {
  const {setAccessToken, setRefreshToken, setUserData} = useContext(AppContext);
  const router = useRouter();
  useEffect(() => {
    const {code, state} = router.query;
    const storage = window.localStorage;
    if (!code || !state || state !== storage.getItem(SPOTIFY_STATE)) return;
    const redirect = async () => {
      const {accessToken, refreshToken} = await fetchSpotifyTokens(code, storage);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      const res = await window.fetch('http://daddy.creativelabsucla.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      const data = await res.json();
      setUserData(data);
      void router.push(getUrlPath());
    };
    void redirect();
  }, [router]);

  return (
    <Layout>
      <div>
        LOGGING YOU INTO AURGY
      </div>
    </Layout>
  );
}
