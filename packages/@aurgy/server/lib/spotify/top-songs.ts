import fetch, {Response} from 'node-fetch';
import { logger, objectToForm } from '../../utils';
import { HTTPResponseError } from '../../utils/errors';
import { TOP_TRACKS } from '../private/SPOTIFY_ENDPOINTS';
import { IArtist, Song } from '../song';
import { getAudioFeatures } from './audio-features';
import { SongResponse, TopSongResponse } from './types';

function fetchTopSongs(accessToken: string, offset: number): Promise<Response> {
  const query: Record<string, any> = {
    limit: 50,
    time_range: 'medium_term',
    offset,
  };

  return fetch(TOP_TRACKS + '?' + objectToForm(query), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function getTopSongs(accessToken: string): Promise<Record<string, Song>>{
  const responses = await Promise.all([fetchTopSongs(accessToken, 0), fetchTopSongs(accessToken, 49)]);

  responses.forEach((res: Response) => {
    if (!res.ok) throw new HTTPResponseError(res);
  });

  const data = await Promise.all(responses.map(res => res.json()));

  // a list of song id's to grab audio features later
  const reevaluate: string[] = [];

  const songMap = await data.reduce(async (accP: Record<string, Song>, {items}: TopSongResponse) => {
    const acc = await accP;

    await Promise.all(items.map(async (song: SongResponse) => {
      if (song.id in acc) return;

      // If the song exists in the database, we dont need to get the rest of the data
      const potentialSong = await Song.fromId(song.id);
      if (potentialSong !== null) {
        acc[song.id] = potentialSong;
        return;
      }

      // Extract artist information
      const artistInfo = song.artists.reduce((arr: IArtist[], {name, id, uri}: IArtist) => {
        arr.push({name, id, uri});
        return arr;
      }, []);

      // create a new song entry and save for reevaluation
      acc[song.id] = new Song(song.id, {
        ...song,
        duration: song.duration_ms,
        artists: artistInfo,
      });

      reevaluate.push(song.id);
    }));

    return acc;
  }, Promise.resolve({}));

  // reevaluate songs to update with audio features;
  if (reevaluate.length > 0) {
    logger.info(`Grabbing audio features for ${reevaluate.length} songs.`);
    const audioFeaturesMap = await getAudioFeatures(accessToken, ...reevaluate);
    Object.entries(audioFeaturesMap).forEach(([id, audioFeatures]) => {
      const song = songMap[id];
      song.updateAudioFeatures(audioFeatures);
    });
    logger.info('All new songs written to database.');
  }

  return songMap;
}
