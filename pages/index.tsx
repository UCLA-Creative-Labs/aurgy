import Head from 'next/head';
import React, {useContext} from 'react';
import Layout from '../components/Layout';
import * as SpotifyAuth from '../components/SpotifyAuth';
import styles from '../styles/Home.module.scss';
import {AppContext} from './_app';

export default function Home(): JSX.Element {
  const {accessToken, refreshToken, isAuthenticated} = useContext(AppContext);
  return (
    <Layout>
      <h3>Login to get your access token and refresh token</h3>
      <p><b>Access Token:</b> {accessToken}</p>
      <p><b>Refresh Token:</b> {refreshToken}</p>
      {isAuthenticated
        ? <SpotifyAuth.Logout />
        : <SpotifyAuth.default />}
    </Layout>
  );
}
