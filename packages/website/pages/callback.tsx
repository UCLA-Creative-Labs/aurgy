import { useRouter } from 'next/router';
import React, {useContext, useEffect} from 'react';
import Layout from '../components/Layout';
import styles from '../styles/Callback.module.scss';
import {
  getUrlPath,
  SPOTIFY_STATE,
  fetchSpotifyTokens,
} from '../utils';
import { signIn } from '../utils/aurgy';
import {AppContext} from './_app';

export default function SpotifyCallback(): JSX.Element {
  const {setUserData} = useContext(AppContext);
  const router = useRouter();
  useEffect(() => {
    const {code, state} = router.query;
    const storage = window.localStorage;
    if (!code || !state || state !== storage.getItem(SPOTIFY_STATE)) return;
    const redirect = async () => {
      const {refreshToken} = await fetchSpotifyTokens(code, storage);
      const data = await signIn(refreshToken);
      document.cookie = `token=${data.jwt}`;
      setUserData(data);
      void router.push(getUrlPath() + '/me');
    };
    void redirect();
  }, [router]);

  return (
    <Layout>
      <div id={styles['callback-container']}>
        LOGGING YOU INTO AURGY
      </div>
    </Layout>
  );
}
