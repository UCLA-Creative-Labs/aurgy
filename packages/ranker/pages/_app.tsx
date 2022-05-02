import '../styles/globals.scss';
import {SessionProvider} from 'next-auth/react';
import {AppProps} from 'next/app';
import React from 'react';

function MyApp({
  Component, pageProps: {session, ...pageProps},
}: AppProps): JSX.Element {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
