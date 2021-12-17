import React from 'react';
import Layout from '../components/Layout';
import PlaylistVisual from '../components/PlaylistVisual';

function ShaderDemo(): JSX.Element {
  return (
    <Layout>
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <PlaylistVisual width={1000} height={600} />
      </div>
    </Layout>
  );
}

export default ShaderDemo;
