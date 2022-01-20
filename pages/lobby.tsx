import React from 'react';
import Layout from '../components/Layout';
import NamePlate from '../components/NamePlate';
import PlaylistVisual from '../components/PlaylistVisual';

function Lobby(): JSX.Element {
  return (
    <Layout>
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <PlaylistVisual width={1000} height={600} />
        <div className="usersBar">
          <NamePlate shape="circle" name="BRYAN" owner={true} expanded={true} />
          <NamePlate shape="circle" name="BRYAN" owner={true} />
          <NamePlate shape="pentagon" name="ARJUN" />
          <NamePlate shape="hexagon" name="JACK" />
          <NamePlate shape="heptagon" name="LUL" />
          <NamePlate shape="octagon" name="FLARG" />
        </div>
      </div>
    </Layout>
  );
}

export default Lobby;
