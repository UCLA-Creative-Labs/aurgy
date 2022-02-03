import React, {useEffect, useRef, useState} from 'react';
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
  const [isHovered, setIsHovered] = useState(false);
  const [isFirstAnimation, setIsFirstAnimation] = useState(true);

  const containerRef = useRef(null);
  const polygonRef = useRef(null);
  const shortLabelRef = useRef(null);
  const longLabelRef = useRef(null);

  useEffect(() => {
    if (!animate) {
      return;
    }

    if (isFirstAnimation) {
      setIsFirstAnimation(false);
      return;
    }

    animatePolygon({
      target: containerRef.current,
      polygonNode: polygonRef.current,
      forwards: isHovered,
      shape,
    });
    animateNameplate({
      target: shortLabelRef.current,
      subtarget: longLabelRef.current,
      forwards: isHovered,
    });
  }, [isHovered]);

  const className = `${styles.nameplate} ${highlight ? styles.highlight : ''} ${expanded ? styles.expanded : ''}`;

  return (
    <div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
