import React, {useEffect, useRef, useState} from 'react';
import Shape, {Polygon} from '../components/Shape';
import styles from '../styles/lobby.module.scss';
import {animatePolygon, animateNameplate} from '../utils/animations';

export interface NameplateProps {
  name: string;
  shape: Polygon;
  currentUser?: boolean;
  expanded?: boolean;
}

export function Nameplate({name, shape, currentUser = false, expanded = false}: NameplateProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [isFirstAnimation, setIsFirstAnimation] = useState(true);

  const containerRef = useRef(null);
  const polygonRef = useRef(null);
  const shortNameRef = useRef(null);
  const longNameRef = useRef(null);

  useEffect(() => {
    if (isFirstAnimation) {
      setIsFirstAnimation(false);
      return;
    }

    animatePolygon(
      containerRef.current,
      polygonRef.current,
      shape,
      isHovered,
    );
    animateNameplate(
      shortNameRef.current,
      longNameRef.current,
      isHovered,
    );
  }, [isHovered]);

  return (
    <div className={`${styles.nameplate} ${currentUser ? styles.currentUser : ''} ${expanded ? styles.expanded : ''}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className={styles['nameplate-container']} ref={containerRef}>
        <Shape polygon={shape} ref={polygonRef} />
      </div>
      <div className={styles['nameplate-short']} ref={shortNameRef}>{name[0]}</div>
      <div className={styles['nameplate-long']} ref={longNameRef}>{name}</div>
    </div>
  );
}

interface NameplateGroupProps {
  names: NameplateProps[];
  expandCurrentUser?: boolean;
}

function NameplateGroup({names, expandCurrentUser = false}: NameplateGroupProps): JSX.Element {
  return (
    <>
      {names.map(passedProps =>
        <div key={`${passedProps.name}-${passedProps.shape}`}>
          <Nameplate
            name={passedProps.name}
            shape={passedProps.shape}
            currentUser={passedProps.shape === 'circle'}
            expanded={passedProps.shape === 'circle' && expandCurrentUser}
          />
        </div>,
      )}
    </>
  );
}

export default NameplateGroup;
