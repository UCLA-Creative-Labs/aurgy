import CircleType from 'circletype';
import React, {useEffect, useRef} from 'react';
import useTimelineControls from '../hooks/useTimelineControls';
import styles from '../styles/LobbyCircle.module.scss';
import {makeRotationTimeline} from '../utils';
import Link from './Link';
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
      circText.radius(circRef.current.offsetWidth / 2).dir(-1);
    }
    setRadius();
    window.addEventListener('resize', setRadius);

    return () => {
      window.removeEventListener('resize', setRadius);
      circText.destroy();
    };
  }, [ref, circRef]);

  const padName = name?.replace(/./g, '$& ');

  return (
    <div
      ref={circRef}
      onClick={onClick}
      className={`${styles.circle} ${CreateOptions2Style[create]}`}
      onMouseEnter={animateForwards}
      onMouseLeave={animateBackwards}
    >
      <Link href={href} isDisabled={!href}>
        <PlaylistVisual title='' subtitle='' fullSize={false} animate={false} />
      </Link>
      <div className={styles.name} ref={ref}>
        {padName}
      </div>
    </div>
  );
}

export default LobbyCircle;
