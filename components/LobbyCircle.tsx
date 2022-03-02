import React from 'react';
import styles from '../styles/LobbyCircle.module.scss';

enum CreateOptions {
  NotCreate,
  CreateOnly,
  CreateWithLobbies
}

export interface LobbyCircleProps {
  name: string;
  create?: CreateOptions;
}

export function LobbyCircle({name, create = CreateOptions.NotCreate}: LobbyCircleProps): JSX.Element {
  const CreateOptions2Style = {
    [CreateOptions.CreateOnly]: styles.single,
    [CreateOptions.CreateWithLobbies]: styles.create,
  };

  const additionalStyle = create ? CreateOptions2Style[create] : styles.top;

  return (
    <a href='/' className={`${styles.circle} ${additionalStyle}`}>
      <div className={styles.name}>
        {name}
      </div>
    </a>

  );
}

export default LobbyCircle;
