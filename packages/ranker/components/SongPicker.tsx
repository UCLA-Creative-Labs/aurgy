import React from 'react';
import styles from '../styles/SongPicker.module.scss';
import {ISongData} from '../utils/song-data';

interface PickerProps {
  title: React.ReactNode;
  optionA: ISongData;
  optionB: ISongData;
  onPick: (id: string) => void;
}

function SongPicker({title, optionA, optionB, onPick}: PickerProps): JSX.Element {
  return (
    <div>
      <div>{title}</div>
      <div className={styles.media}>
        <iframe width="400" height="250" src={optionA.embedUrl} />
        <iframe width="400" height="250" src={optionB.embedUrl} />
      </div>
      <div className={styles.grid}>
        <div className={styles.card} onClick={() => onPick(optionA.embedUrl)}>
          <h2>{optionA.title}</h2>
          <p>{optionA.artist}</p>
        </div>
        <div className={styles.card} onClick={() => onPick(optionB.embedUrl)}>
          <h2>{optionB.title}</h2>
          <p>{optionB.artist}</p>
        </div>
      </div>
    </div >
  );
}

export default SongPicker;
