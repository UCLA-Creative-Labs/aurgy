import {useSession, signIn} from 'next-auth/react';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import Layout from '../components/Layout';
import SongPicker from '../components/SongPicker';
import {IRankingData} from '../utils/ranking-data';

function Home(): JSX.Element {
  const {data: session} = useSession();
  const [ranking, setRanking] = useState<IRankingData | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadSongs() {
      const res = await window.fetch('/api/get-song');
      const data = await res.json();
      setRanking(data);
    }

    if (!ranking) {
      void loadSongs();
    }
  }, [ranking]);

  const onPick = async (matches: boolean) => {
    const res = await window.fetch('/api/rank-song', {
      method: 'POST',
      body: JSON.stringify({
        songid: ranking.song.id,
        theme: ranking.theme,
        matches,
      }),
    });
    if (!res.ok) {return;}
    setRanking(null);
  };

  if (!session) {
    return (
      <Layout>
        <div>Help build out the Aurgy backend by ranking songs!</div>
        <br />
        <div>
          <button onClick={() => signIn('google', {callbackUrl: router.asPath})}>
                        Sign in with Google
          </button>
        </div>
      </Layout>
    );
  }

  if (!ranking) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  const title = <p>Would you categorize this song under the theme: <b>{ranking.theme}</b></p>;
  return (
    <Layout>
      <SongPicker
        title={title}
        song={ranking.song}
        onPick={onPick}
      />
    </Layout>
  );
}

export default Home;
