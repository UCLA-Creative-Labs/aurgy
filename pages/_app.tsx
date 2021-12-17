import {AppProps} from 'next/app';
import React, { createContext, useEffect, useState } from 'react';
import { AURGY_USER_DATA, SPOTIFY_ACCESS_TOKEN, SPOTIFY_REFRESH_TOKEN } from '../utils';
import '../styles/globals.scss';
import { IUserData } from '../utils/user-data';

export interface IAppContext {
  accessToken: string | null;
  setAccessToken: (at: string) => void,
  refreshToken: string | null;
  setRefreshToken: (rt: string) => void,
  userData: IUserData | null,
  setUserData: (data: IUserData) => void,
  isAuthenticated: boolean;
  signOut: () => void;
}

export const AppContext = createContext<IAppContext>({
  accessToken: null,
  setAccessToken: (_at: string) => null,
  refreshToken: null,
  setRefreshToken: (_rt: string) => null,
  userData: null,
  setUserData: (_data) => null,
  isAuthenticated: false,
  signOut: () => null,
});

function MyApp({ Component, pageProps }: AppProps): React.ReactNode {
  const [ accessToken, setAccessToken ] = useState<string | null> (null);
  const [ refreshToken, setRefreshToken ] = useState<string | null> (null);
  const [ userData, setUserData ] = useState<IUserData | null>(null);
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);

  useEffect(() => {
    const storage = window.localStorage;
    setAccessToken(storage.getItem(SPOTIFY_ACCESS_TOKEN));
    setRefreshToken(storage.getItem(SPOTIFY_REFRESH_TOKEN));
    setUserData(JSON.parse(storage.getItem(AURGY_USER_DATA)));
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

    // If refresh token is null then we are not authenticated
    setIsAuthenticated(!!refreshToken);
  }, [refreshToken]);

  useEffect(() => {
    const storage = window.localStorage;
    userData
      ? storage.setItem(AURGY_USER_DATA, JSON.stringify(userData))
      : storage.removeItem(AURGY_USER_DATA);

    // If user data is null then we are not authenticated
    setIsAuthenticated(!!userData);
  }, [userData]);

  const signOut = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUserData(null);

    // make doubling work here but making sure this is set to null
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider value={{
      accessToken,
      setAccessToken,
      refreshToken,
      setRefreshToken,
      userData,
      setUserData,
      isAuthenticated,
      signOut,
    }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
