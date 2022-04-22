import fetch from 'node-fetch';
import { objectToForm } from '../../utils';
import { HTTPResponseError } from '../../utils/errors';
import { ACOUSTIC_FEATURES } from '../private/SPOTIFY_ENDPOINTS';
import { isAudioFeaturesResponse } from './types';

/**
 * A song's audio features.
 *
 * Taken directly from the Spotify API website for reference.
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-several-audio-features
 */
export interface AudioFeatures {
  /**
   * A confidence measure from 0.0 to 1.0 of whether the track
   * is acoustic. 1.0 represents high confidence the track is
   * acoustic.
   *
   * 0 <= acousticness <= 1
   */
  readonly acousticness: number;
  /**
   * Danceability describes how suitable a track is for dancing
   * based on a combination of musical elements including tempo,
   * rhythm stability, beat strength, and overall regularity.
   * A value of 0.0 is least danceable and 1.0 is most danceable.
   */
  readonly danceability: number;
  /**
   * Energy is a measure from 0.0 to 1.0 and represents a
   * perceptual measure of intensity and activity. Typically,
   * energetic tracks feel fast, loud, and noisy. For example,
   * death metal has high energy, while a Bach prelude scores
   * low on the scale. Perceptual features contributing to this
   * attribute include dynamic range, perceived loudness, timbre,
   * onset rate, and general entropy.
   */
  readonly energy: number;
  /**
   * Predicts whether a track contains no vocals. "Ooh" and "aah"
   * sounds are treated as instrumental in this context. Rap or
   * spoken word tracks are clearly "vocal". The closer the
   * instrumentalness value is to 1.0, the greater likelihood
   * the track contains no vocal content. Values above 0.5 are
   * intended to represent instrumental tracks, but confidence
   * is higher as the value approaches 1.0.
   */
  readonly instrumentalness: number;
  /**
   * Detects the presence of an audience in the recording. Higher
   * liveness values represent an increased probability that the
   * track was performed live. A value above 0.8 provides strong
   * likelihood that the track is live.
   */
  readonly liveness: number;
  /**
   * The overall loudness of a track in decibels (dB). Loudness
   * values are averaged across the entire track and are useful
   * for comparing relative loudness of tracks. Loudness is the
   * quality of a sound that is the primary psychological
   * correlate of physical strength (amplitude). Values typically
   * range between -60 and 0 db.
   */
  readonly loudness: number;
  /**
   * Mode indicates the modality (major or minor) of a track,
   * the type of scale from which its melodic content is derived.
   * Major is represented by 1 and minor is 0.
   */
  readonly mode: number;
  /**
   * Speechiness detects the presence of spoken words in a track.
   * The more exclusively speech-like the recording (e.g. talk show,
   * audio book, poetry), the closer to 1.0 the attribute value.
   * Values above 0.66 describe tracks that are probably made
   * entirely of spoken words. Values between 0.33 and 0.66 describe
   * tracks that may contain both music and speech, either in sections
   * or layered, including such cases as rap music. Values below 0.33
   * most likely represent music and other non-speech-like tracks.
   */
  readonly speechiness: number;
  /**
   * The overall estimated tempo of a track in beats per minute
   * (BPM). In musical terminology, tempo is the speed or pace
   * of a given piece and derives directly from the average beat
   * duration.
   */
  readonly tempo: number;
  /**
   * A measure from 0.0 to 1.0 describing the musical positiveness
   * conveyed by a track. Tracks with high valence sound more
   * positive (e.g. happy, cheerful, euphoric), while tracks with
   * low valence sound more negative (e.g. sad, depressed, angry).
   *
   * 0 <= valence <= 1
   */
  readonly valence: number;
}

export async function getAudioFeatures(
  accessToken: string,
  ...songIds: string[]
): Promise<Record<string, AudioFeatures>> {
  const query: Record<string, string> = {
    ids: songIds.join(','),
  };

  const res = await fetch(ACOUSTIC_FEATURES + '?' + objectToForm(query), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new HTTPResponseError(res);
  }

  const data = await res.json();

  if (!isAudioFeaturesResponse(data)) {
    throw new Error('Error: Response from Spotify not in audio features response form');
  }

  return data.audio_features.reduce((acc: Record<string, AudioFeatures>, audioFeature) => {
    if (audioFeature.id in acc) return acc;
    acc[audioFeature.id] = audioFeature;
    return acc;
  }, {});
}
