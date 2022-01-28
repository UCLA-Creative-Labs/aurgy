import React, {useEffect, useRef, useState} from 'react';
import Shape, {Polygon} from '../components/Shape';
import styles from '../styles/lobby.module.scss';
import {animatePolygon, animateNameplate} from '../utils/animations';

interface BaseAnimatedProps {
  shape: Polygon;
  highlight?: boolean;
  expanded?: boolean;
  animate?: boolean;
}

interface AnimatedShapeProps extends BaseAnimatedProps {
  shortText: string;
  longText: string;
}

interface OverflowProps {
  value: number;
}

export interface NameplateProps extends BaseAnimatedProps {
  name: string;
}

interface NameplateGroupProps {
  names: NameplateProps[];
  expandCurrentUser?: boolean;
  limit?: number;
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

  useEffect(animate
    ? () => {
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
    }
    : () => null, [isHovered]);

  const className = `${styles.nameplate} ${highlight ? styles.highlight : ''} ${expanded ? styles.expanded : ''}`;

  return (
    <div className={className} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className={styles['nameplate-container']} ref={containerRef}>
        <Shape polygon={shape} ref={polygonRef} />
      </div>
      <div className={styles['nameplate-short']} ref={shortLabelRef}>{shortText}</div>
      <div className={styles['nameplate-long']} ref={longLabelRef}>{longText}</div>
    </div>
  );
}

function Nameplate({
  name,
  shape,
  highlight = false,
  expanded = false,
}: NameplateProps): JSX.Element {
  return (
    <AnimatedShape
      shortText={name[0]}
      longText={name}
      shape={shape}
      highlight={highlight}
      expanded={expanded}
    />
  );
}

function Overflow({value}: OverflowProps): JSX.Element {
  return (
    <AnimatedShape
      shortText={`+${value}`}
      longText=""
      shape="diamond"
      highlight={false}
      expanded={false}
      animate={false}
    />
  );
}


function NameplateGroup({
  names,
  expandCurrentUser = false,
  limit = null,
}: NameplateGroupProps): JSX.Element {
  limit = limit ?? names.length;

  return (
    <>
      {names.slice(0, limit).map(passedProps =>
        <div key={`${passedProps.name}-${passedProps.shape}`}>
          <Nameplate
            name={passedProps.name}
            shape={passedProps.shape}
            highlight={passedProps.shape === 'circle'}
            expanded={passedProps.shape === 'circle' && expandCurrentUser}
          />
        </div>,
      )}
      {names.length > limit
        ? <Overflow value={names.length - limit} />
        : ''
      }
    </>
  );
}

export default NameplateGroup;
