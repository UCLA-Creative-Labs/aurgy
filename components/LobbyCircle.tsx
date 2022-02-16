import React from 'react';
import styles from '../styles/home.module.scss';

export interface LobbyCircleProps {
    name: string;
    // create options
    // 0 = not create
    // 1 = create with no lobbies
    // 2 = create with lobbies
    create?: number;
    offset?: boolean;
}

export function LobbyCircle({name, create = 0, offset = false}: LobbyCircleProps): JSX.Element {
    let finalStyle;

    if (create == 1) {
        finalStyle = `${styles.circle} ${styles.single}`;
    } else if (create == 2) {
        finalStyle = `${styles.circle} ${styles.create}`;
    } else if (offset) {
        finalStyle = `${styles.circle} ${styles.offset}`;
    } else {
        finalStyle = `${styles.circle} ${styles.top}`;
    }
    
    return (
        <a href='/' className={finalStyle}>
            <div className={styles.name}>
                {name}
            </div>
        </a>                
        
    )
}

export default LobbyCircle;