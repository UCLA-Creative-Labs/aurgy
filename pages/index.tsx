import React, {useEffect, useState} from 'react';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import LobbyCircle, {CreateOptions} from '../components/LobbyCircle';
import useModal from '../hooks/useModal';
import styles from '../styles/home.module.scss';
import {fetchAllLobbies, createLobby, fetchLobbyById} from '../utils/aurgy';
import {indexCookie} from '../utils/cookies';
import {ILobbyDataBase} from '../utils/lobby-data';

export default function Home(): JSX.Element {
  const [Modal, showModal, hideModal] = useModal();
  const [lobbies, setLobbies] = useState<ILobbyDataBase[]>([]);
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');

  useEffect(() => {
    async function loadData() {
      const token = indexCookie('token');
      if (!token || token === 'undefined') return;

      const res = await fetchAllLobbies(token);
      setLobbies(res.lobbies);
    }
    void loadData();
  }, []);

  async function onConfirm() {
    const token = indexCookie('token');
    if (!token || token === 'undefined') return;

    const data = await createLobby({lobbyName: name, theme}, token);
    const lobby = await fetchLobbyById(data.id, token);
    setLobbies(lobbies.concat({...lobby, id: data.id}));
    hideModal();
  }

  if (!lobbies) {
    return <Loading />;
  }

  return (
    <Layout>
      <div className={styles.container}>
        <LobbyCircle
          name='CREATE'
          onClick={() => showModal()}
          create={!lobbies.length ? CreateOptions.CreateOnly : CreateOptions.CreateWithLobbies} />
        {lobbies.map((lobby, index) => (
          <LobbyCircle name={lobby.name} href={'/lobby?id=' + lobby.id} key={index} />
        ))}
      </div>
      <Modal
        title="CREATE LOBBY"
        onCancel={() => hideModal()}
        onConfirm={onConfirm}
      >
        <input type="text" placeholder="NAME" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="THEME NAME" value={theme} onChange={(e) => setTheme(e.target.value)} />
      </Modal>
    </Layout>
  );
}
