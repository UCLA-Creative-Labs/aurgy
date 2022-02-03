import React from 'react';
import Layout from '../components/Layout';
import NameplateGroup, {NameplateGroupProps} from '../components/nameplate/NameplateGroup';
import PlaylistVisual from '../components/PlaylistVisual';
import styles from '../styles/lobby.module.scss';

const USERS: NameplateGroupProps['names'] = [
  {
    name: 'BRYAN', shape: 'circle',
  },
  {
    name: 'NACH', shape: 'pentagon',
  },
  {
    name: 'SMALLBERG', shape: 'hexagon',
  },
  {
    name: 'PALSBERG', shape: 'heptagon',
  },
  {
    name: 'REIHER', shape: 'octagon',
  },
];

const SAMPLE_PLAYLIST_DATA = [
  {
    title: 'REALLY LONG TITLE GOES HERE',
    artist: 'LOREM, IPSUM, DOLOR, EGADS',
    users: [USERS[0]],
  },
  {
    title: 'FEEL IT STILL',
    artist: 'PORTUGAL. THE MAN',
    users: [USERS[1], USERS[2]],
  },
  {
    title: 'HEAT WAVES',
    artist: 'GLASS ANIMALS',
    users: [USERS[0], USERS[2], USERS[3], USERS[4]],
  },
  {
    title: 'FLOAT',
    artist: 'HARBOUR',
    users: USERS,
  },
  {
    title: 'MAINE',
    artist: 'NOAH KAHAN',
    users: [USERS[2]],
  },
  {
    title: 'THINKING OUT LOUD',
    artist: 'ED SHEERAN',
    users: [USERS[3], USERS[4]],
  },
];

function Lobby(): JSX.Element {
  return (
    <Layout>
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <PlaylistVisual
          title="CREATIVE SLAPS"
          subtitle="PEANUT BUTTER JAM"
        />

        <div id={styles.userbar}>
          <NameplateGroup names={USERS} expandCurrentUser={true} />
          <button>invite</button>
        </div>

        <div id={styles.playlist}>
          {SAMPLE_PLAYLIST_DATA.map((song) => (
            <div key={`${song.title}-${song.artist}`} className={styles.song}>
              <h4>{song.title}</h4>
              <h4>{song.artist}</h4>
              <div className={styles['user-container']}>
                <NameplateGroup names={song.users} limit={4} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Lobby;
