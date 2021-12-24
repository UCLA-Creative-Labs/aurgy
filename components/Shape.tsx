import React from 'react';

interface ShapeProps {
  polygon: Polygon
}

export type Polygon = 'pentagon' | 'hexagon' | 'heptagon' | 'octagon' | 'circle';

export const PolygonPoints = {
  pentagon: '50 4, 96 38, 82 93, 30 93, 50 93, 70 93, 18 93, 4 38',
  hexagon: '50 4, 95 27, 95 73, 72 85, 50 96, 27.5 84.5, 5 73, 5 27',
  heptagon: '50 4, 90 25, 96 63, 75 95, 50 95, 25 95, 3 63, 10 25',
  octagon: '50 4, 83 17, 96 50, 83 83, 50 96, 17 83, 4 50, 17 17',
};

function Circle(): JSX.Element {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="7" />
    </svg>
  );
}

function Pentagon(ref): JSX.Element {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points={PolygonPoints.pentagon} ref={ref} stroke="white" strokeWidth="7" />
    </svg>
  );
}

function Hexagon(ref): JSX.Element {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points={PolygonPoints.hexagon} ref={ref} stroke="white" strokeWidth="7" />
    </svg>
  );
}

function Heptagon(ref): JSX.Element {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points={PolygonPoints.heptagon} ref={ref} stroke="white" strokeWidth="7" />
    </svg>
  );
}

function Octagon(ref): JSX.Element {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points={PolygonPoints.octagon} ref={ref} stroke="white" strokeWidth="7" />
    </svg>
  );
}

function Shape({polygon}: ShapeProps, ref): JSX.Element {
  switch (polygon) {
    case 'circle':
      return Circle(ref);
    case 'pentagon':
      return Pentagon(ref);
    case 'hexagon':
      return Hexagon(ref);
    case 'heptagon':
      return Heptagon(ref);
    case 'octagon':
      return Octagon(ref);
  }
}
export default React.forwardRef(Shape);
