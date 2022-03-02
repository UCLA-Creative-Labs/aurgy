import React from 'react';
import styles from '../styles/LobbyCircle.module.scss';

enum CreateOptions {
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
  create?: CreateOptions;
}

export function LobbyCircle({name, create = CreateOptions.NotCreate}: LobbyCircleProps): JSX.Element {
  return (
    <a href='/' className={`${styles.circle} ${CreateOptions2Style[create]}`}>
      <div className={styles.name}>
        {name}
      </div>
    </a>

  );
}

export default LobbyCircle;
