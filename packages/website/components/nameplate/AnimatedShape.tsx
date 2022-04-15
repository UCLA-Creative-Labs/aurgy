import React, {useEffect, useRef} from 'react';
import useTimelineControls from '../../hooks/useTimelineControls';
import styles from '../../styles/nameplate.module.scss';
import {makeNameplateTimeline} from '../../utils';
import Shape, {Polygon} from '../Shape';

export interface ButtonProps {
  text: string;
  callback: () => void;
}

export interface BaseAnimatedProps {
  shape: Polygon;
  highlight?: boolean;
  expanded?: boolean;
  animate?: boolean;
  buttonOptions?: ButtonProps;
}

interface AnimatedShapeProps extends BaseAnimatedProps {
  shortText: string;
  longText: string;
}

function AnimatedShape({
  shortText,
  longText,
  shape,
  buttonOptions,
  highlight = false,
  expanded = false,
  animate = true,
}: AnimatedShapeProps): JSX.Element {
  const containerRef = useRef(null);
  const polygonRef = useRef(null);
  const shortLabelRef = useRef(null);
  const longLabelRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    tlRef.current = makeNameplateTimeline({
      container: containerRef.current,
      polygon: polygonRef.current,
      shape,
      shortLabel: shortLabelRef.current,
      longLabel: longLabelRef.current,
    });
  }, []);

  const [animateForwards, animateBackwards] = useTimelineControls({tlRef, animate});

  const className = `${styles.nameplate} ${highlight ? styles.highlight : ''} ${expanded ? styles.expanded : ''}`;

  const optionalButton =
        <div className={styles['nameplate-button']} onClick={buttonOptions?.callback}>
            X
        </div>;

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
      <div className={styles['nameplate-long']} ref={longLabelRef}>
        <div className={styles['nameplate-text']}>{longText}</div>
        {buttonOptions && optionalButton}
      </div>
    </div >
  );
}

export default AnimatedShape;
