import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import Layout from '../components/Layout';
import {NameplateProps} from '../components/nameplate/Nameplate';
import NameplateGroup from '../components/nameplate/NameplateGroup';
import PlaylistVisual from '../components/PlaylistVisual';
import Tooltip from '../components/Tooltip';
import styles from '../styles/lobby.module.scss';
import {fetchLobbyById} from '../utils/aurgy';
import {indexCookie} from '../utils/cookies';
import {ILobbyData} from '../utils/lobby-data';

const USERS: NameplateProps[] = [
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
  const {query} = useRouter();
  const [lobbyData, setLobbyData] = useState<ILobbyData>(null);

  useEffect(() => {
    async function loadData() {
      const token = indexCookie('token');
      if (!token || token === 'undefined' || query?.id == null) return;

      const data = await fetchLobbyById(query.id as string, token);
      setLobbyData(data);
    }
    void loadData();
  }, []);

  if (lobbyData == null) {
    return (
      <Layout>
        <div className={styles.container}>Invalid lobby.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <PlaylistVisual
          title={lobbyData.name}
          subtitle={lobbyData.theme}
        />

        <div id={styles.userbar} data-tip={'test'}>
          <NameplateGroup names={USERS} expandCurrentUser={true} buttonOptions={{
            text: 'DELETE USER',
            callback: () => null,
          }} />
          <button>invite</button>
        </div>

        <div id={styles.playlist}>
          {SAMPLE_PLAYLIST_DATA.map((song) => (
            <div key={`${song.title}-${song.artist}`} className={styles.song}>
              <Tooltip text="play">
                <h4 className={styles.title}>{song.title}</h4>
              </Tooltip>
              <h4 className={styles.artist}>{song.artist}</h4>
              <div className={styles['user-container']}>
                <NameplateGroup names={song.users} limit={3} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Lobby;
