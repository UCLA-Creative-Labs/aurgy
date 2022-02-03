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
  text: string;
  value: number;
}

export function Overflow({text, value}: OverflowProps): JSX.Element {
  return (
    <Tooltip text={text}>
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
