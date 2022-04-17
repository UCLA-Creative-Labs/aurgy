import {AnimeTimelineInstance} from 'animejs';
import {useCallback} from 'react';
import {
  playTimeline,
  reverseTimeline,
} from '../utils/animations/timeline';

interface Props {
  tlRef: React.MutableRefObject<AnimeTimelineInstance>,
  animate: boolean
}

type Return = [play: () => void, reverse: () => void];

function useTimelineControls({tlRef, animate}: Props): Return {
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

export default useTimelineControls;
