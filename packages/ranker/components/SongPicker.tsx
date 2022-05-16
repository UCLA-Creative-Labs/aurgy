import React from 'react';
import styles from '../styles/SongPicker.module.scss';
import {ISongData} from '../utils/ranking-data';

interface PickerProps {
  title: React.ReactNode;
  song: ISongData;
  onPick: (match: boolean) => void;
}

function SongPicker({title, song, onPick}: PickerProps): JSX.Element {
  return (
    <div>
      <div>{title}</div>
      <div className={styles.media}>
        <iframe width="400" height="250" src={song.embedUrl} />
      </div>
      <div className={styles.grid}>
        <div className={styles.card} onClick={() => onPick(true)}>
          <h2>YEA</h2>
        </div>
        <div className={styles.card} onClick={() => onPick(false)}>
          <h2>NAH</h2>
        </div>
      </div>
    </div >
  );
}

export default SongPicker;
