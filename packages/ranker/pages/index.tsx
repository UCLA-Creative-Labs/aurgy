import {useSession, signIn} from 'next-auth/react';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import Layout from '../components/Layout';
import SongPicker from '../components/SongPicker';
import {IRankingData} from '../utils/song-data';

function Home(): JSX.Element {
  const {data: session} = useSession();
  const [ranking, setRanking] = useState<IRankingData | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadSongs() {
      const res = await window.fetch('/api/rank-songs');
      const data = await res.json();
      setRanking(data);
    }
    void loadSongs();
  }, []);

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

  const title = <p>Pick the song that sounds more like: <b>{ranking.theme}</b></p>;
  return (
    <Layout>
      <SongPicker
        title={title}
        optionA={ranking.song1}
        optionB={ranking.song2}
        onPick={() => null}
      />
    </Layout>
  );
}

export default Home;
