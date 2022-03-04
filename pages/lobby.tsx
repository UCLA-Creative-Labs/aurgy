import {useRouter} from 'next/router';
import React, {useContext, useEffect, useState} from 'react';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import {NameplateProps} from '../components/nameplate/Nameplate';
import NameplateGroup from '../components/nameplate/NameplateGroup';
import PlaylistVisual from '../components/PlaylistVisual';
import Tooltip from '../components/Tooltip';
import useModal from '../hooks/useModal';
import styles from '../styles/lobby.module.scss';
import {getUrlPath} from '../utils';
import {fetchLobbyById} from '../utils/aurgy';
import {indexCookie} from '../utils/cookies';
import {ILobbyData} from '../utils/lobby-data';
import {makeShapeMap, Polygon} from '../utils/shapes';
import {getTrackUrl} from '../utils/spotify';
import {AppContext} from './_app';

interface LobbyData extends ILobbyData {
  participantShapes: {[name: string]: Polygon};
}

function Lobby(): JSX.Element {
  const router = useRouter();
  const {userData, signOut} = useContext(AppContext);
  const [Modal, showModal, hideModal] = useModal();
  const [lobbyData, setLobbyData] = useState<LobbyData>(null);
  const [error, setError] = useState<string>(null);

  function reloginUser() {
    signOut();
    void router.push(getUrlPath() + '/me');
  }

  useEffect(() => {
    async function loadData() {
      const token = indexCookie('token');
      if (!token || token === 'undefined') {
        reloginUser();
        return;
      }

      try {
        if (router.query?.id == null) throw 'id not provided';
        const data = await fetchLobbyById(router.query.id as string, token);
        const map = makeShapeMap(userData.name, data.participants);
        setLobbyData({...data, participantShapes: map});
      }
      catch (status) {
        if (status === 403) { // token expired
          reloginUser();
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

  function addShapeToProps(users: string[]): NameplateProps[] {
    return users.map(
      name => ({name, shape: lobbyData.participantShapes[name] ?? 'pentagon'}),
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
          <NameplateGroup names={addShapeToProps(lobbyData.participants)} expandCurrentUser={true} buttonOptions={{
            text: 'DELETE USER',
            callback: () => null,
          }} />
          <button onClick={() => showModal()}>invite</button>
        </div>

        <div id={styles.playlist}>
          {lobbyData.songs.length
            ? lobbyData.songs.map((song) => {
              const artists = song.artists.join(', ');
              const contributors = addShapeToProps(song.contributors);
              return (
                <div key={`${song.name}-${artists}`} className={styles.song}>
                  <Tooltip text="PLAY">
                    <a href={getTrackUrl(song.id)}>
                      <h4 className={styles.title}>{song.name}</h4>
                    </a>
                  </Tooltip>
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
