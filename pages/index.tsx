import React from 'react';
import Layout from '../components/Layout';
import PlaylistVisual from '../components/PlaylistVisual';
import styles from '../styles/home.module.scss';

export default function Home(): JSX.Element {

  return (
    <Layout>
      <div id={styles.lobbies}>
        {new Array(11).fill(null).map((_, idx) => (
          <PlaylistVisual
            key={idx}
            title="CREATIVE SLAPS"
            subtitle="PEANUT BUTTER JAM"
            fullSize={false}
            animate={false}
          />))}
      </div>
    </Layout>
  );
}
