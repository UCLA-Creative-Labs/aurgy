import React from 'react';
import styles from '../styles/LobbyCircle.module.scss';

enum Create {
  NotCreate,
  CreateOnly,
  CreateWithLobbies
}

export interface LobbyCircleProps {
  name: string;
  create?: number;
}

export function LobbyCircle({name, create = Create.NotCreate}: LobbyCircleProps): JSX.Element {

  let finalStyle;

  if (create == Create.CreateOnly) {
    finalStyle = styles.single;
  } else if (create == Create.CreateWithLobbies) {
    finalStyle = styles.create;
  } else {
    finalStyle = styles.top;
  }

  return (
    <a href='/' className={`${styles.circle} ${finalStyle}`}>
      <div className={styles.name}>
        {name}
      </div>
    </a>

  );
}

export default LobbyCircle;
