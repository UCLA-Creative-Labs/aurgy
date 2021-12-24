import React, { useContext } from 'react';
import Layout from '../components/Layout';
import SpotifyAuth from '../components/SpotifyAuth';

import styles from '../styles/Me.module.scss';
import { deleteAccount } from '../utils/aurgy';
import { indexCookie } from '../utils/cookies';
import { AppContext } from './_app';

export default function Me(): JSX.Element {
  const {userData, isAuthenticated, signOut} = useContext(AppContext);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div id={styles['login-container']}>
          <SpotifyAuth />
        </div>
      </Layout>
    );
  }

  const content = {
    'Remaining Lobbies': 3,
    'Account Type': userData.accountType,
  };

  const onClick = () => {
    const token = indexCookie('token');
    if (!token || token === 'undefined') return;
    void deleteAccount(token);
    signOut();
  };

  return (
    <Layout id={styles.main}>
      <div id={styles['me-container']}>
        <h2>{userData.name}</h2>
        {Object.entries(content).map(([key, value]) => {
          return (
            <div className={styles.row} key={key}>
              <p className={styles.label}>{key}</p>
              <p className={styles.value}>{value}</p>
            </div>
          );
        })}
        <div className={styles.row}>
          <SpotifyAuth />
          <button onClick={onClick}>
            Delete Account
          </button>
        </div>
      </div>
    </Layout>
  );
}
