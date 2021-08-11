import {AppProps} from 'next/app';
import React, { createContext, useEffect, useState } from 'react';
import { SPOTIFY_ACCESS_TOKEN, SPOTIFY_REFRESH_TOKEN } from '../utils';
import '../styles/globals.scss';

export interface IAppContext {
  accessToken?: string;
  refreshToken?: string;
  isAuthenticated: boolean;
  setIsAuthenticated: (bool: boolean) => void;
}

export const AppContext = createContext<IAppContext>({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  setIsAuthenticated: (bool: boolean) => null,
});


function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [ accessToken, setAccessToken ] = useState<string | null> (null);
  const [ refreshToken, setRefreshToken ] = useState<string | null> (null);
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);

  useEffect(() => {
    const registerSpotifyAuth = () => {
      const storage = window.localStorage;
      const _at = storage.getItem(SPOTIFY_ACCESS_TOKEN);
      const _rt = storage.getItem(SPOTIFY_REFRESH_TOKEN);

      setAccessToken(_at);
      setRefreshToken(_rt);
      setIsAuthenticated(!!(_at && _rt));
    };

    window.addEventListener('storage', registerSpotifyAuth);

    registerSpotifyAuth();

    return () => {
      window.removeEventListener('storage', registerSpotifyAuth);
    }
  }, []);

  return (
    <AppContext.Provider value={{
      accessToken,
      refreshToken,
      isAuthenticated,
      setIsAuthenticated,
    }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
