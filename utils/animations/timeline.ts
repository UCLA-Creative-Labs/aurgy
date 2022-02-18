import anime, {AnimeTimelineInstance} from 'animejs';
import {Polygon} from '../../components/Shape';
import styles from '../../styles/lobby.module.scss';
import tipStyles from '../../styles/tooltip.module.scss';
import {PARAM_DEFAULTS, fadeElement, morphPolygon} from './animations';

interface LabelTargets {
  readonly shortLabel: HTMLElement;
  readonly longLabel: HTMLElement;
}

interface PolygonTargets {
  readonly container: HTMLElement;
  readonly polygon: HTMLElement;
  readonly shape: Polygon;
}

export interface NameplateTargets extends PolygonTargets, LabelTargets {}

function addPolygonAnimation(
  timeline: AnimeTimelineInstance,
  {container, polygon, shape}: PolygonTargets,
): void {
  const spinContainer = {
    ...PARAM_DEFAULTS,
    targets: container,
    rotate: 270,
    duration: 200,
  };
  const hideContainer = fadeElement({
    target: container,
    duration: 200,
    fadeIn: false,
  });
  const morph = morphPolygon({
    target: polygon,
    shape,
    duration: 200,
  });

  timeline
    .add(spinContainer, 0)
    .add(hideContainer, 200);
  if (morph) {
    timeline.add(morph, 0);
  }
}

function addLabelAnimation(
  timeline: AnimeTimelineInstance,
  {shortLabel, longLabel}: LabelTargets,
): void {
  const hideShort = fadeElement({
    target: shortLabel,
    duration: 200,
    fadeIn: false,
  });
  const showLong = fadeElement({
    target: longLabel,
    duration: 100,
  });
  const expandLong = {
    ...PARAM_DEFAULTS,
    targets: longLabel,
    maxWidth: styles.nameplateWidthMax,
    padding: styles.nameplatePaddingMax,
    duration: 200,
  };

  timeline
    .add(hideShort, 200)
    .add(showLong, 200)
    .add(expandLong, 200);
}


export function makeNameplateTimeline({
  container,
  polygon,
  shape,
  shortLabel,
  longLabel,
}: NameplateTargets,
): anime.AnimeTimelineInstance {
  const tl = anime.timeline({
    autoplay: false,
  });

  addPolygonAnimation(tl, {
    container,
    polygon,
    shape,
  });
  addLabelAnimation(tl, {
    shortLabel,
    longLabel,
  });

  return tl;
}

export function makeTooltipTimeline(
  tooltip: HTMLElement,
): anime.AnimeTimelineInstance {
  const tl = anime.timeline({
    autoplay: false,
  });

  const show = fadeElement({
    target: tooltip,
    duration: 200,
  });
  const shiftMargin = {
    ...PARAM_DEFAULTS,
    targets: tooltip,
    marginTop: tipStyles.tooltipMargintopMax,
    duration: 200,
  };
  tl.add(show, 0).add(shiftMargin, 0);

  return tl;
}

export function playTimeline(timeline: AnimeTimelineInstance): void {
  if (timeline.began && timeline.reversed) {
    // after first load and having been played backwards, we need to re-reverse
    timeline.reverse();
  }
  timeline.play();
}

export function reverseTimeline(timeline: AnimeTimelineInstance): void {
  if (!timeline.reversed) {
    // prevents repeated reverses when spamming the animation
    timeline.reverse();
  }
  timeline.play();
}
