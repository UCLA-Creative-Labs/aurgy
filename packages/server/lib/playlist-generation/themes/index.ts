import { AudioFeatures } from '../..';
import { dissociating } from './dissociating';

export type ThemeConditions = {
  min: number,
  max: number,
  target: number,
  weight: number,
}

export type Theme = {
  [Property in keyof AudioFeatures]: ThemeConditions;
};

export enum THEME {
  DISSOCIATING_ON_THE_HIGHWAY = 'dissociating on the highway',
}

export const theme2Conditions: Record<THEME, Theme> = {
  [THEME.DISSOCIATING_ON_THE_HIGHWAY]: dissociating,
};
