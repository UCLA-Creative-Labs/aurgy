import {useSession, signOut} from 'next-auth/react';
import Head from 'next/head';
import React from 'react';
import styles from '../styles/Layout.module.scss';

export interface LayoutProps {
  children: React.ReactNode;
  id?: string;
  title?: string;
  description?: string;
}

function Nav(): JSX.Element {
  const {data: session} = useSession();
  const logout = (
    <div>
      {session?.user?.email}
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );

  return (
    <div className={styles.nav}>
      <div>RANKY</div>
      {session && logout}
    </div>
  );
}

function Layout(props: LayoutProps): JSX.Element {
  const title = props.title ?? 'Ranky';
  const description = props.description ?? 'Help build out the Aurgy backend by ranking songs';


  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aurgy.creativelabsucla.com/" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://assets.creativelabsucla.com/metadata.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content="https://assets.creativelabsucla.com/metadata.png" />

        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Nav />

      <main id={props.id} className={styles.container}>
        {props.children}
      </main>
    </>
  );
}

export default Layout;
