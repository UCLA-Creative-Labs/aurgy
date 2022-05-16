import {collection, query, where, getDocs, CollectionReference, QueryDocumentSnapshot} from 'firebase/firestore';
import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import {_Firebase} from '../../utils/firebase';
import {IRankingData} from '../../utils/ranking-data';

async function queryNotInArray(coll: CollectionReference, array: any[], field = 'id')
  : Promise<QueryDocumentSnapshot[]> {
  const CHUNK_SIZE = 10; // firestore limit for 'not-in' query
  const snapshots = [];

  if (array.length) {
    for (let i = 0; i < array.length; i += CHUNK_SIZE) {
      const chunk = array.slice(i, i + CHUNK_SIZE);
      const q = query(coll, where(field, 'not-in', chunk));
      const snapshot = await getDocs(q);
      snapshots.push(...snapshot.docs);
    }
  } else {
    const snapshot = await getDocs(coll);
    snapshots.push(...snapshot.docs);
  }
  return snapshots;
}

function randomDoc(snapshots: QueryDocumentSnapshot[]): any {
  const randIdx = Math.floor(Math.random() * snapshots.length);
  return snapshots[randIdx].data();
}

export default async (req: NextApiRequest, res: NextApiResponse<IRankingData>): Promise<void> => {
  const firebase = new _Firebase();
  const db = firebase.db;
  const songsRef = collection(db, 'songs');
  const themesRef = collection(db, 'themes');

  const session = await getSession({req});
  const user = await firebase.get({path: 'ranking-users/' + session.user.email});

  const themes = await getDocs(themesRef);
  const themeToRank = randomDoc(themes.docs);

  const rankedSongs = user.rankings
    .filter(ranking => ranking.theme === themeToRank.name)
    .map(ranking => ranking.songid);
  const unrankedSongs = await queryNotInArray(songsRef, rankedSongs);
  const songToRank = randomDoc(unrankedSongs);

  const data = {
    theme: themeToRank.name,
    song: {
      artist: songToRank.artists[0].name,
      title: songToRank.name,
      id: songToRank.id,
      embedUrl: 'https://open.spotify.com/embed/track/' + songToRank.id,
    },
  };
  res.status(200).json(data);
};
