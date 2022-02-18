import React, {useEffect, useCallback, useRef} from 'react';
import Shape, {Polygon} from '../../components/Shape';
import styles from '../../styles/lobby.module.scss';
import {makeNameplateTimeline, playTimeline, reverseTimeline} from '../../utils';

export interface BaseAnimatedProps {
  shape: Polygon;
  highlight?: boolean;
  expanded?: boolean;
  animate?: boolean;
}

interface AnimatedShapeProps extends BaseAnimatedProps {
  shortText: string;
  longText: string;
}

function AnimatedShape({
  shortText,
  longText,
  shape,
  highlight = false,
  expanded = false,
  animate = true,
}: AnimatedShapeProps): JSX.Element {
  const containerRef = useRef(null);
  const polygonRef = useRef(null);
  const shortLabelRef = useRef(null);
  const longLabelRef = useRef(null);
  const tlRef = useRef(null);

  // The following timeline init/play/reverse code is identical for different timelines.
  // TODO: Make a hook with generics to encapsulate this.
  // (see utils/animations/useTimelineAnimation.tsx for first attempt, idk why it doesn't work)

  useEffect(() => {
    tlRef.current = makeNameplateTimeline({
      container: containerRef.current,
      polygon: polygonRef.current,
      shape,
      shortLabel: shortLabelRef.current,
      longLabel: longLabelRef.current,
    });
  }, []);

  const [animateForwards, animateBackwards] = [true, false].map(forwards =>
    useCallback(() => {
      if (!animate) return;
      forwards ? playTimeline(tlRef.current) : reverseTimeline(tlRef.current);
    }, [animate]),
  );

  const className = `${styles.nameplate} ${highlight ? styles.highlight : ''} ${expanded ? styles.expanded : ''}`;

  return (
    <div
      className={className}
      onMouseEnter={animateForwards}
      onMouseLeave={animateBackwards}
    >
      <div className={styles['nameplate-container']} ref={containerRef}>
        <Shape polygon={shape} ref={polygonRef} />
      </div>
      <div className={styles['nameplate-short']} ref={shortLabelRef}>{shortText}</div>
      <div className={styles['nameplate-long']} ref={longLabelRef}>{longText}</div>
    </div >
  );
}

export default AnimatedShape;
