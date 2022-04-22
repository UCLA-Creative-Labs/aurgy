import { Song } from '../song';
import { AudioFeatures } from '../spotify';
import { THEME, theme2Conditions, ThemeConditions } from './themes';

export type Song2Score = {song: Song, score: number};

export const compareSongScores = (a: Song2Score, b: Song2Score): number => a.score < b.score ? -1 : 1;

type AudioFeatureEntry = [feature: keyof AudioFeatures, condition: ThemeConditions];

export function computeScore(af: AudioFeatures, theme: THEME): number {
  const conditions = theme2Conditions[theme];

  const isQualifying = !Object.entries(conditions).find(([feature, condition]: AudioFeatureEntry) => {
    if (condition.weight === 0) return false;
    return af[feature] < condition.min || condition.max < af[feature];
  });

  if (!isQualifying) return 0;

  const rawScore = Object.entries(conditions).reduce((acc, [feature, {target, weight}]: AudioFeatureEntry) => {
    return acc + (1 - Math.abs(target - af[feature])) * weight;
  }, 0);

  const numWeighted = Object.values(conditions).reduce((acc, {weight}) => acc + +(!!weight), 0);

  return rawScore / numWeighted;
}
