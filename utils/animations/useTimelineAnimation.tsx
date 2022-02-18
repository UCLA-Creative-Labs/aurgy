import {AnimeTimelineInstance} from 'animejs';
import {useCallback, useEffect, useRef} from 'react';
import {
  playTimeline,
  reverseTimeline,
} from './timeline';

interface Props<T> {
  genTimeline: (targets: T) => AnimeTimelineInstance,
  targets: T,
  animate: boolean
}

function useTimelineAnimation<T>({genTimeline, targets, animate}: Props<T>)
  : [play: () => void, reverse: () => void] {
  const tlRef = useRef<AnimeTimelineInstance>(null);

  useEffect(() => {
    tlRef.current = genTimeline(targets);
  }, [genTimeline, targets]);

  const play = useCallback(() => {
    if (!animate) return;
    playTimeline(tlRef.current);
  }, [animate, tlRef.current]);

  const reverse = useCallback(() => {
    if (!animate) return;
    reverseTimeline(tlRef.current);
  }, [animate, tlRef.current]);

  return [play, reverse];
}

export default useTimelineAnimation;
