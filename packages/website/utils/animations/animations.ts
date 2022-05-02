import {AnimeParams} from 'animejs';
import {PolygonPoints} from '../../components/Shape';
import {Polygon} from '../shapes';

interface BaseAnimationOptions {
  readonly target: HTMLElement;
  readonly duration: number;
}

interface MorphPolygonOptions extends BaseAnimationOptions {
  readonly shape: Polygon;
}

interface FadeOptions extends BaseAnimationOptions {
  readonly fadeIn?: boolean;
}

export const PARAM_DEFAULTS = {
  easing: 'easeInOutCubic',
};

export function morphPolygon({target, shape, duration}: MorphPolygonOptions,
): AnimeParams {
  if (shape === 'circle' || shape === 'diamond') {
    return;
  }

  const polygonOrdering = ['pentagon', 'hexagon', 'heptagon', 'octagon'];
  const points = polygonOrdering
    .slice(polygonOrdering.indexOf(shape))
    .map((poly) => ({value: PolygonPoints[poly]}));

  return {
    targets: target,
    points: points,
    easing: 'linear',
    duration,
  };
}

export function fadeElement(
  {target, duration, fadeIn = true}: FadeOptions,
): AnimeParams {
  return {
    ...PARAM_DEFAULTS,
    targets: target,
    opacity: fadeIn ? 1 : 0,
    duration,
  };
}
