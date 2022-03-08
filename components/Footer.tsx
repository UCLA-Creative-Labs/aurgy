import React from 'react';
import styles from '../styles/Navbar.module.scss';

export default function Footer(): JSX.Element {
  return (
    <div id={styles.navbar}>
      <div id={styles['logo-container']}>
                EXPERIENCE MUSIC, TOGETHER.
      </div>
    </div>
  );
}
