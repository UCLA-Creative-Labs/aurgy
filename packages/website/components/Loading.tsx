import React from 'react';
import styles from '../styles/loading.module.scss';
import Layout from './Layout';

interface LoadingProps {
  error?: string;
}

function Loading({error}: LoadingProps): JSX.Element {
  return (
    <Layout>
      <div className={`${styles['loading-text']}`}>
        {error ?? 'LOADING...'}
      </div>
    </Layout>
  );
}

export default Loading;
