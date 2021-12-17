import React, {useContext} from 'react';
import Layout from '../components/Layout';
import * as SpotifyAuth from '../components/SpotifyAuth';
import {AppContext} from './_app';

export default function Home(): React.ReactNode {
  const {accessToken, refreshToken, isAuthenticated} = useContext(AppContext);
  return (
    <Layout>
      <h1>AURGY</h1>
      <h3>Login to get your access token and refresh token</h3>
      <p><b>Access Token:</b> {accessToken}</p>
      <p><b>Refresh Token:</b> {refreshToken}</p>
      {isAuthenticated
        ? <SpotifyAuth.Logout />
        : <SpotifyAuth.default />}
    </Layout>
  );
}
