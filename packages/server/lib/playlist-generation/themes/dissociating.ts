import { Theme } from '.';

const NO_WEIGHT = { min: 0, max: 1, target: 0, weight: 0 };

export const dissociating: Theme = {
  acousticness: NO_WEIGHT,
  danceability: NO_WEIGHT,
  energy: NO_WEIGHT,
  instrumentalness: NO_WEIGHT,
  liveness: {
    min: 0,
    max: 0.25,
    target: 0.15,
    weight: 1,
  },
  loudness: NO_WEIGHT,
  mode: NO_WEIGHT,
  speechiness: NO_WEIGHT,
  tempo: NO_WEIGHT,
  valence: NO_WEIGHT,
};
