import React from 'react';
import Tooltip from '../Tooltip';
import AnimatedShape, {BaseAnimatedProps} from './AnimatedShape';

export interface NameplateProps extends BaseAnimatedProps {
  name: string;
}

function Nameplate({
  name,
  shape,
  highlight = false,
  expanded = false,
}: NameplateProps): JSX.Element {
  return (
    <AnimatedShape
      shortText={name[0]}
      longText={name}
      shape={shape}
      highlight={highlight}
      expanded={expanded}
    />
  );
}

export default Nameplate;

interface OverflowProps {
  items: string[];
  value: number;
}

export function Overflow({items, value}: OverflowProps): JSX.Element {
  return (
    <Tooltip text={items.join('\n')}>
      <AnimatedShape
        shortText={`+${value}`}
        longText=""
        shape="diamond"
        highlight={false}
        expanded={false}
        animate={false}
      />
    </Tooltip>
  );
}
