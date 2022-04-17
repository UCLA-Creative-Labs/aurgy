import React, {useEffect, useRef} from 'react';
import styles from '../styles/tooltip.module.scss';
import {makeTooltipTimeline, playTimeline, reverseTimeline} from '../utils';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

function Tooltip({text, children}: TooltipProps): JSX.Element {
  const elemRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    tlRef.current = makeTooltipTimeline(elemRef.current);
  }, []);

  return (
    <div className={styles['tooltip-wrapper']} onMouseLeave={() => reverseTimeline(tlRef.current)}>
      <div className={styles.tooltip} ref={elemRef}>{text}</div>
      <div onMouseEnter={() => playTimeline(tlRef.current)}>
        {children}
      </div>
    </div >
  );
}

export default Tooltip;
