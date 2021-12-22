import React, {useContext} from 'react';
import Layout from '../components/Layout';
import * as SpotifyAuth from '../components/SpotifyAuth';
import {AppContext} from './_app';

export default function Home(): React.ReactNode {
  const {isAuthenticated} = useContext(AppContext);
  return (
    <Layout>
      <h1>AURGY</h1>
      {isAuthenticated
        ? <><div>You are authenticated</div><SpotifyAuth.Logout /></>
        : <SpotifyAuth.default />}
    </Layout>
  );
}
