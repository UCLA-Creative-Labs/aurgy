import {useRouter} from 'next/router';
import React, {useContext, useEffect, useState} from 'react';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import {NameplateProps} from '../components/nameplate/Nameplate';
import NameplateGroup from '../components/nameplate/NameplateGroup';
import PlaylistVisual from '../components/PlaylistVisual';
import useModal from '../hooks/useModal';
import styles from '../styles/lobby.module.scss';
import {fetchLobbyById} from '../utils/aurgy';
import {indexCookie} from '../utils/cookies';
import {ILobbyData} from '../utils/lobby-data';
import {makeShapeMap} from '../utils/shapes';
import {AppContext} from './_app';

type NameplatePropsMap = {[name: string]: NameplateProps};

interface LobbyData extends ILobbyData {
  nameplateProps: NameplatePropsMap;
}

function Lobby(): JSX.Element {
  const router = useRouter();
  const {userData, relogin} = useContext(AppContext);
  const [Modal, showModal, hideModal] = useModal();
  const [lobbyData, setLobbyData] = useState<LobbyData>(null);
  const [error, setError] = useState<string>(null);

  useEffect(() => {
    async function loadData() {
      const token = indexCookie('token');
      if (!token || token === 'undefined') {
        relogin();
        return;
      }

      try {
        if (router.query?.id == null) throw 'id not provided';
        const data = await fetchLobbyById(router.query.id as string, token);
        const participantNames = data.users.map(u => u.name);
        const propsMap = makePropsMap(userData.name, participantNames);
        setLobbyData({...data, nameplateProps: propsMap});
      }
      catch (status) {
        if (status === 403) { // token expired
          relogin();
        } else { // user not in lobby, invalid id, or id not provided
          setError('INVALID LOBBY.');
        }
      }
    }
    void loadData();
  }, [router]);

  if (!lobbyData) {
    return <Loading error={error} />;
  }

  function makePropsMap(currentUser: string, participants: string[]): NameplatePropsMap {
    const shapeMap = makeShapeMap(currentUser, participants);
    const propsMap = {};
    participants.forEach(name => {
      propsMap[name] = {name, shape: shapeMap[name] ?? 'pentagon'};
    });
    return propsMap;
  }

  return (
    <Layout>
      <div className={styles.container}>
        <PlaylistVisual
          title={lobbyData.name}
          subtitle={lobbyData.theme}
        />

        <div id={styles.userbar} data-tip={'test'}>
          <NameplateGroup
            names={lobbyData.users.map(u => lobbyData.nameplateProps[u.name])}
            expandCurrentUser={true}
            buttonOptions={{
              text: 'DELETE USER',
              callback: () => null,
            }}
          />
          <button onClick={() => showModal()}>invite</button>
        </div>

        <div id={styles.playlist}>
          {lobbyData.songs.length
            ? lobbyData.songs.map((song) => {
              const artists = song.artists.join(', ');
              const contributors = song.contributors.map(name => lobbyData.nameplateProps[name]);
              return (
                <div key={`${song.name}-${artists}`} className={styles.song}>
                  <h4 className={styles.title}>{song.name}</h4>
                  <h4 className={styles.artist}>{artists}</h4>
                  <div className={styles['user-container']}>
                    <NameplateGroup names={contributors} limit={3} />
                  </div>
                </div>
              );
            })
            : <div className={styles['center-across']}>NO SONGS YET, CHECK BACK LATER.</div>}
        </div>
      </div>

      <Modal
        title="SEND THIS LINK"
        onCancel={() => hideModal()}
        onConfirm={() => null}
        showFooter={false}
      >
        <div>https://cl.com/me</div>
        <button>COPY TO CLIPBOARD</button>
      </Modal>
    </Layout>
  );
}

export default Lobby;
