import {useRouter} from 'next/router';
import React from 'react';

import styles from '../styles/Navbar.module.scss';
import Link from './Link';
import SpotifyAuth from './SpotifyAuth';

export default function Navbar(): JSX.Element {
  const router = useRouter();

  function strikeCurrentPath(path: string, str: string): JSX.Element {
    return router.asPath === path ? <del>{str}</del> : <p>{str}</p>;
  }

  return (
    <div id={styles.navbar}>
      <div id={styles['logo-container']}>
        <Link href='/'><p>Aurgy</p></Link>
      </div>
      <div id={styles['links-container']}>
        <Link href='/me'>{strikeCurrentPath('/me', 'me?')}</Link>
        <Link href='/lobby'>{strikeCurrentPath('/lobby', 'lobbys')}</Link>
        <SpotifyAuth />
      </div>
    </div>
  );
}
