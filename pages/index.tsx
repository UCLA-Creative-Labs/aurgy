import { create } from 'domain';
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
]

export default function Home(): JSX.Element {
  let empty = true;
  if (SAMPLE_LOBBIES.length > 0) {
    empty = false;
  }

  let createButton = empty ? <LobbyCircle name='CREATE' create={1}/> 
                           : <LobbyCircle name='CREATE' create={2}/>

  return (
    <Layout>
      <div className={styles.container}>
        {createButton}
        {SAMPLE_LOBBIES.map((lobby, index) => (
          <LobbyCircle name={lobby} offset={!index}/>  // offset only applied to the first element
        ))}
      </div>
    </Layout>
  );
}
