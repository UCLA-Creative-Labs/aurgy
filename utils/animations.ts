import anime from 'animejs';
import {Polygon, PolygonPoints} from '../components/Shape';
import styles from '../styles/lobby.module.scss';
import tipStyles from '../styles/tooltip.module.scss';

interface BaseAnimationOptions {
  readonly target: HTMLElement;
  readonly forwards: boolean;
  readonly duration?: number;
}

interface MorphPolygonOptions extends BaseAnimationOptions {
  readonly shape: Polygon;
}

interface AnimateNameplateOptions extends BaseAnimationOptions {
  readonly subtarget: HTMLElement;
}

interface AnimatePolygonOptions extends MorphPolygonOptions {
  readonly polygonNode: HTMLElement;
}

const DEFAULTS = {
  easing: 'easeInOutCubic',
  delay: 0,
};

function morphPolygon(
  {target, forwards, shape}: MorphPolygonOptions,
): void {
  if (shape === 'circle' || shape === 'diamond') {
    return;
  }

  const polygonOrdering = ['pentagon', 'hexagon', 'heptagon', 'octagon'];
  const points = polygonOrdering
    .slice(polygonOrdering.indexOf(shape))
    .map((poly) => ({value: PolygonPoints[poly]}));
  const rev = points.slice().reverse();

  anime({
    targets: target,
    points: forwards ? points : rev,
    duration: 300,
    easing: 'linear',
  });
}

function fadeElementOut(
  {target, forwards, duration}: BaseAnimationOptions,
): void {
  anime({
    ...DEFAULTS,
    targets: target,
    opacity: forwards ? 0 : 1,
    duration: duration ?? 500,
  });
}

function fadeElementIn(
  {target, forwards, duration}: BaseAnimationOptions,
): void {
  fadeElementOut({
    target,
    forwards: !forwards,
    duration,
  });
}

export function animatePolygon(
  {target, polygonNode, forwards, shape}: AnimatePolygonOptions,
): void {
  anime({
    ...DEFAULTS,
    targets: target,
    rotate: forwards ? 180 : 0,
    duration: 300,
  });
  morphPolygon({
    target: polygonNode,
    shape,
    forwards,
  });
  fadeElementOut({
    target, forwards,
  });
}

export function animateNameplate(
  {target, subtarget, forwards}: AnimateNameplateOptions,
): void {
  fadeElementOut({
    target,
    forwards,
  });
  fadeElementIn({
    target: subtarget,
    forwards,
  });
  anime({
    ...DEFAULTS,
    targets: subtarget,
    maxWidth: forwards ? styles.nameplateWidthMax : styles.nameplateWidthMin,
    padding: forwards ? styles.nameplatePaddingMax : styles.nameplatePaddingMin,
    duration: 300,
  });
}

export function animateTooltip(
  {target, forwards}: BaseAnimationOptions,
): void {
  fadeElementIn({
    target,
    forwards,
    duration: 200,
  });
  anime({
    ...DEFAULTS,
    targets: target,
    marginTop: forwards ? tipStyles.tooltipMargintopMax : tipStyles.tooltipMargintopMin,
    duration: 200,
  });
}
