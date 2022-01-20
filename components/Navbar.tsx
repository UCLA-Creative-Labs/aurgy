import React from 'react';

import styles from '../styles/Navbar.module.scss';
import Link from './Link';
import SpotifyAuth from './SpotifyAuth';

export default function Navbar(): JSX.Element {
  return (
    <div id={styles.navbar}>
      <div id={styles['logo-container']}>
        <Link href='/'>Aurgy</Link>
      </div>
      <div id={styles['links-container']}>
        <Link href='/me'>me?</Link>
        <Link href='/lobby'>lobbys</Link>
        <SpotifyAuth />
      </div>
    </div>
  );
}
