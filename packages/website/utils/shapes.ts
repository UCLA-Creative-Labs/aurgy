export type UserPolygon = 'pentagon' | 'hexagon' | 'heptagon' | 'octagon';

export type OtherPolygon = 'circle' | 'diamond';

export type Polygon = UserPolygon | OtherPolygon;

export type PolygonMap = {[user: string]: Polygon};

function getRandomUserShape(): UserPolygon {
  switch (Math.floor(Math.random() * 3)) {
    case 0:
      return 'pentagon';
    case 1:
      return 'hexagon';
    case 2:
      return 'heptagon';
    default:
      return 'octagon';
  }
}

export function makeShapeMap(creator: string, users: string[]): PolygonMap {
  const map: PolygonMap = {};
  users.forEach(user => map[user] = getRandomUserShape());
  map[creator] = 'circle';
  return map;
}
