import type {NextApiRequest, NextApiResponse} from 'next';
import {IRankingData} from '../../utils/song-data';

const SAMPLE_DATA: IRankingData = {
  theme: 'DISASSOCIATING ON THE HIGHWAY',
  song1: {
    title: 'Rolled',
    artist: 'Astley',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  song2: {
    title: "I'm blue",
    artist: 'Eiffel 65',
    embedUrl: 'https://www.youtube.com/embed/BinWA0EenDY',
  },
};

export default async (_: NextApiRequest, res: NextApiResponse<IRankingData>): Promise<void> => {
  res.status(200).json(SAMPLE_DATA);
};
