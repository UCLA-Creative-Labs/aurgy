import CircleType from 'circletype';
import NextLink from 'next/link';
import React, {useEffect, useRef} from 'react';
import useTimelineControls from '../hooks/useTimelineControls';
import styles from '../styles/LobbyCircle.module.scss';
import {makeRotationTimeline} from '../utils';
import PlaylistVisual from './PlaylistVisual';

export enum CreateOptions {
  NotCreate,
  CreateOnly,
  CreateWithLobbies
}

const CreateOptions2Style = {
  [CreateOptions.NotCreate]: styles.top,
  [CreateOptions.CreateOnly]: styles.single,
  [CreateOptions.CreateWithLobbies]: styles.create,
};

export interface LobbyCircleProps {
  name: string;
  href?: string;
  onClick?: () => void;
  create?: CreateOptions;
}

export function LobbyCircle({
  name,
  href,
  onClick = () => null,
  create = CreateOptions.NotCreate,
}: LobbyCircleProps): JSX.Element {
  const ref = useRef(null);
  const circRef = useRef(null);
  const tlRef = useRef(null);
  const [animateForwards, animateBackwards] = useTimelineControls({tlRef, animate: true});

  useEffect(() => {
    tlRef.current = makeRotationTimeline(circRef.current);
  }, []);

  useEffect(() => {
    const circText = new CircleType(ref.current);

    function setRadius() {
      circText.radius(window.innerHeight * .35 / 2).dir(-1);
    }
    setRadius();
    window.addEventListener('resize', setRadius);

    return () => {
      window.removeEventListener('resize', setRadius);
      circText.destroy();
    };
  }, [ref]);

  const padName = name?.replace(/./g, '$& ');

  const base = (
    <div
      className={`${styles.circle} ${CreateOptions2Style[create]}`}
      onClick={onClick}
      ref={circRef}
      onMouseEnter={animateForwards}
      onMouseLeave={animateBackwards}
    >
      <PlaylistVisual title='' subtitle='' fullSize={false} animate={false} />
      <div className={styles.name} ref={ref}>
        {padName}
      </div>
    </div>
  );
  return href ? (<NextLink href={href}>{base}</NextLink>) : base;
}

export default LobbyCircle;
