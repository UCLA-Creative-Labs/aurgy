import React from 'react';
import Layout from '../components/Layout';
import LobbyCircle  from '../components/LobbyCircle';
import styles from '../styles/home.module.scss';

const SAMPLE_LOBBIES = [
  'jeff',
  'annie',
  'troy',
  'abed',
  'britta',
  'shirley',
  'pierce',
  'chang',
  'craig',
  'starburns',
  'magnitude',
  'ian',
  'buzz',
];

export default function Home(): JSX.Element {
  return (
    <Layout>
      <div className={styles.container}>
        <LobbyCircle name='CREATE' create={!SAMPLE_LOBBIES.length ? 1 : 2}/>
        {SAMPLE_LOBBIES.map((lobby, index) => (
          <LobbyCircle name={lobby} key={index}/>
        ))}
      </div>
    </Layout>
  );
}
