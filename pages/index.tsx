import React, {useEffect, useState} from 'react';
import Layout from '../components/Layout';
import Link from '../components/Link';
import Modal from '../components/Modal';
import {fetchAllLobbies, createLobby, fetchLobbyById} from '../utils/aurgy';
import {indexCookie} from '../utils/cookies';
import {ILobbyData} from '../utils/lobby-data';

export default function Home(): JSX.Element {
  const [showModal, setShowModal] = useState(false);
  const [lobbies, setLobbies] = useState<ILobbyData[]>([]);
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');

  useEffect(() => {
    async function loadData() {
      const token = indexCookie('token');
      if (!token || token === 'undefined') return;

      const ids = await fetchAllLobbies(token);
      const lobbyData = await Promise.all(ids.lobbies.map(id => fetchLobbyById(id, token)));
      setLobbies(lobbyData);
    }
    void loadData();
  }, []);

  async function onConfirm() {
    const token = indexCookie('token');
    if (!token || token === 'undefined') return;

    const data = await createLobby({lobbyName: name, theme}, token);
    const lobby = await fetchLobbyById(data.id, token);
    setLobbies(lobbies.concat(lobby));
    setShowModal(false);
  }

  return (
    <Layout>
      <h1>AURGY</h1>

      <h3>lobbies:</h3>
      <div>
        {lobbies && lobbies.map(lobby =>
          <div key={lobby.id}>
            <Link href={'/lobby?id=' + lobby.id}>GO TO LOBBY</Link>
            <div>name: {lobby.name}</div>
            <div>theme: {lobby.theme}</div>
            <div>id: {lobby.id}</div>
            <div>managerId: {lobby.managerId}</div>
            <div>participants: {lobby.participants.join(', ')}</div>
            <br />
          </div>,
        )}
      </div>
      <button onClick={() => setShowModal(true)}>CREATE LOBBY</button>
      <Modal
        title="CREATE LOBBY"
        show={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={onConfirm}
      >
        <input type="text" placeholder="NAME" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="THEME NAME" value={theme} onChange={(e) => setTheme(e.target.value)} />
      </Modal>
    </Layout>
  );
}
