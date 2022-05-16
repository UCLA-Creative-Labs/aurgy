import type {NextApiRequest, NextApiResponse} from 'next';
import {getSession} from 'next-auth/react';
import {_Firebase} from '../../utils/firebase';
import {IRankingData} from '../../utils/ranking-data';

export default async (req: NextApiRequest, res: NextApiResponse<IRankingData>): Promise<void> => {
  const firebase = new _Firebase();

  const session = await getSession({req});
  const user = await firebase.get({path: 'ranking-users/' + session.user.email});

  const body = JSON.parse(req.body);
  const newRankings = user.rankings.concat({
    songid: body.songid,
    theme: body.theme,
    matches: body.matches,
  });

  void firebase.put({
    path: 'ranking-users/' + session.user.email,
    data: {...user, rankings: newRankings},
  });

  res.status(200).end();
};
