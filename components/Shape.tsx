import React from 'react';
import styles from '../styles/lobby.module.scss';

interface ShapeProps {
  polygon: Polygon
}

export type Polygon = 'pentagon' | 'hexagon' | 'heptagon' | 'octagon' | 'circle' | 'diamond';

export const PolygonPoints = {
  pentagon: '50 4, 96 38, 82 93, 30 93, 50 93, 70 93, 18 93, 4 38',
  hexagon: '50 4, 95 27, 95 73, 72 85, 50 96, 27.5 84.5, 5 73, 5 27',
  heptagon: '50 4, 90 25, 96 63, 75 95, 50 95, 25 95, 3 63, 10 25',
  octagon: '50 4, 83 17, 96 50, 83 83, 50 96, 17 83, 4 50, 17 17',
  diamond: '50 4, 96 50, 50 96, 4 50',
};

function Shape({polygon}: ShapeProps, ref): JSX.Element {
  let points: string;
  switch (polygon) {
    case 'circle':
      return (
        <svg width={styles.nameplateSize} height={styles.nameplateSize}
          viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="7" ref={ref} />
        </svg>
      );
    case 'diamond':
      points = PolygonPoints.diamond;
      break;
    case 'pentagon':
      points = PolygonPoints.pentagon;
      break;
    case 'hexagon':
      points = PolygonPoints.hexagon;
      break;
    case 'heptagon':
      points = PolygonPoints.heptagon;
      break;
    case 'octagon':
      points = PolygonPoints.octagon;
      break;
  }

  return (
    <svg width={styles.nameplateSize} height={styles.nameplateSize}
      viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points={points} ref={ref} stroke="white" strokeWidth="7" />
    </svg>
  );
}
export default React.forwardRef<SVGPolygonElement, ShapeProps>(Shape);
