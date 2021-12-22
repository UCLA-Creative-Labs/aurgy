import React from 'react';
import Layout from '../components/Layout';
import PlaylistVisual from '../components/PlaylistVisual';

interface NamePlateProps {
  name: string;
  shape: string;
}

function NamePlate({name, shape}: NamePlateProps): JSX.Element {
  return (
    <div className="namePlate">
      <div className={`polygon ${shape}`} >
        <div className={`polygon-inner ${shape}`}>
        </div>
      </div>
      <div className="namePlate-short">{name[0]}</div>
      <div className="namePlate-long">{name}</div>
    </div>
  );
}

function ShaderDemo(): JSX.Element {
  return (
    <Layout>
      <div style={{
        display: 'flex',
        margin: '25px',
      }}>
        <NamePlate shape="circle" name="BRYAN" />
        <NamePlate shape="pentagon" name="ARJUN" />
        <NamePlate shape="hexagon" name="JACK" />
        <NamePlate shape="heptagon" name="LUL" />
        <NamePlate shape="octagon" name="FLARGH" />
      </div>
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {/* <PlaylistVisual width={1000} height={600} /> */}
      </div>
    </Layout>
  );
}

export default ShaderDemo;
