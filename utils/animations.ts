import anime from 'animejs';
import {Polygon, PolygonPoints} from '../components/Shape';
import {
  namePlateWidthMin,
  namePlateWidthMax,
  namePlatePaddingMin,
  namePlatePaddingMax,
} from '../styles/lobby.module.scss';

function animate(target: HTMLElement, key: string, val: string | number, duration, delay = 0): void {
  anime({
    targets: target,
    [key]: val,
    duration,
    easing: 'easeInOutCubic',
    delay,
  });
}

function morphPolygon(target: HTMLElement, shape: Polygon, forwards: boolean, delay = 0): void {
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
    delay,
  });
}

export function animatePolygon(
  containerNode: HTMLElement,
  polygonNode: HTMLElement,
  shape: Polygon,
  forwards: boolean,
): void {
  if (forwards) {
    animate(containerNode, 'rotate', 180, 300);
    morphPolygon(polygonNode, shape, true);
    animate(containerNode, 'opacity', 0, 500);
  }
  else {
    animate(containerNode, 'rotate', 0, 300);
    morphPolygon(polygonNode, shape, false);
    animate(containerNode, 'opacity', 1, 500);
  }
}

export function animateNamePlate(
  shortNameNode: HTMLElement,
  longNameNode: HTMLElement,
  forwards: boolean,
): void {
  if (forwards) {
    animate(shortNameNode, 'opacity', 0, 500);
    animate(longNameNode, 'opacity', 1, 500);
    animate(longNameNode, 'maxWidth', namePlateWidthMax, 300);
    animate(longNameNode, 'padding', namePlatePaddingMax, 400);
  }
  else {
    animate(shortNameNode, 'opacity', 1, 500);
    animate(longNameNode, 'opacity', 0, 500);
    animate(longNameNode, 'maxWidth', namePlateWidthMin, 300);
    animate(longNameNode, 'padding', namePlatePaddingMin, 400);
  }
}
