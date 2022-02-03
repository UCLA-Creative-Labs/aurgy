import React from 'react';
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
  value: number;
}

export function Overflow({value}: OverflowProps): JSX.Element {
  return (
    <AnimatedShape
      shortText={`+${value}`}
      longText=""
      shape="diamond"
      highlight={false}
      expanded={false}
      animate={false}
    />
  );
}
