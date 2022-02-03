import React, {useCallback, useRef} from 'react';
import Shape, {Polygon} from '../../components/Shape';
import styles from '../../styles/lobby.module.scss';
import {animatePolygon, animateNameplate} from '../../utils/animations';

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

  const [animateForwards, animateBackwards] = [true, false].map(forwards =>
    useCallback(() => {
      if (!animate) return;
      animatePolygon({
        target: containerRef.current,
        polygonNode: polygonRef.current,
        forwards,
        shape,
      });
      animateNameplate({
        target: shortLabelRef.current,
        subtarget: longLabelRef.current,
        forwards,
      });
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
