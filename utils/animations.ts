import anime from 'animejs';
import {Polygon, PolygonPoints} from '../components/Shape';
import styles from '../styles/lobby.module.scss';

const DEFAULTS = {
  easing: 'easeInOutCubic',
  delay: 0,
};

function morphPolygon(
  target: HTMLElement,
  shape: Polygon,
  forwards: boolean,
): void {
  if (shape === 'circle') {
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

export function animatePolygon(
  containerNode: HTMLElement,
  polygonNode: HTMLElement,
  shape: Polygon,
  forwards: boolean,
): void {
  anime({
    ...DEFAULTS,
    targets: containerNode,
    rotate: forwards ? 180 : 0,
    duration: 300,
  });
  morphPolygon(polygonNode, shape, forwards);
  anime({
    ...DEFAULTS,
    targets: containerNode,
    opacity: forwards ? 0 : 1,
    duration: 500,
  });
}

export function animateNameplate(
  shortNameNode: HTMLElement,
  longNameNode: HTMLElement,
  forwards: boolean,
): void {
  anime({
    ...DEFAULTS,
    targets: shortNameNode,
    opacity: forwards ? 0 : 1,
    duration: 500,
  });
  anime({
    ...DEFAULTS,
    targets: longNameNode,
    opacity: forwards ? 1 : 0,
    duration: 500,
  });
  anime({
    ...DEFAULTS,
    targets: longNameNode,
    maxWidth: forwards ? styles.nameplateWidthMax : styles.nameplateWidthMin,
    padding: forwards ? styles.nameplatePaddingMax : styles.nameplatePaddingMin,
    duration: 300,
  });
}
