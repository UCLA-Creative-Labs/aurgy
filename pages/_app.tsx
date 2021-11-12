import {AppProps} from 'next/app';
import React, { createContext, useEffect, useState } from 'react';
import { SPOTIFY_ACCESS_TOKEN, SPOTIFY_REFRESH_TOKEN } from '../utils';
import '../styles/globals.scss';

export interface IAppContext {
  accessToken: string | null;
  setAccessToken: (at: string) => void,
  refreshToken: string | null;
  setRefreshToken: (at: string) => void,
  isAuthenticated: boolean;
  signOut: () => void;
}

export const AppContext = createContext<IAppContext>({
  accessToken: null,
  setAccessToken: (_at: string) => null,
  refreshToken: null,
  setRefreshToken: (_rt: string) => null,
  isAuthenticated: false,
  signOut: () => null,
});


function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [ accessToken, setAccessToken ] = useState<string | null> (null);
  const [ refreshToken, setRefreshToken ] = useState<string | null> (null);
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);

  useEffect(() => {
    const storage = window.localStorage;
    setAccessToken(storage.getItem(SPOTIFY_ACCESS_TOKEN));
    setRefreshToken(storage.getItem(SPOTIFY_REFRESH_TOKEN));
  }, []);

  useEffect(() => {
    const storage = window.localStorage;
    accessToken
      ? storage.setItem(SPOTIFY_ACCESS_TOKEN, accessToken)
      : storage.removeItem(SPOTIFY_REFRESH_TOKEN);
  }, [accessToken]);

  useEffect(() => {
    const storage = window.localStorage;
    refreshToken
      ? storage.setItem(SPOTIFY_REFRESH_TOKEN, refreshToken)
      : storage.removeItem(SPOTIFY_REFRESH_TOKEN);
    setIsAuthenticated(!!refreshToken);
  }, [refreshToken]);

  const signOut = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider value={{
      accessToken,
      setAccessToken,
      refreshToken,
      setRefreshToken,
      isAuthenticated,
      signOut,
    }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
