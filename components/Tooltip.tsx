import React, {useRef} from 'react';
import styles from '../styles/lobby.module.scss';
import {animateTooltip} from '../utils/animations';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

function Tooltip({text, children}: TooltipProps): JSX.Element {
  const ref = useRef(null);

  const [animateForwards, animateBackwards] = [true, false].map(forwards => () => {
    animateTooltip({
      target: ref.current,
      forwards,
    });
  });

  return (
    <div className={styles['tooltip-wrapper']} onMouseLeave={animateBackwards}>
      <div className={styles.tooltip} ref={ref}>{text}</div>
      <div onMouseEnter={animateForwards}>
        {children}
      </div>
    </div >
  );
}

export default Tooltip;
