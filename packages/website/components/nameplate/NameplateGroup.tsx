import React from 'react';
import {ButtonProps} from './AnimatedShape';
import Nameplate, {NameplateProps, Overflow} from './Nameplate';

export interface NameplateGroupProps {
  names: NameplateProps[];
  expandCurrentUser?: boolean;
  limit?: number;
  buttonOptions?: ButtonProps;
}

function NameplateGroup({
  names,
  expandCurrentUser = false,
  limit: propLimit,
  buttonOptions,
}: NameplateGroupProps): JSX.Element {
  const limit = propLimit ?? names.length;

  return (
    <>
      {names.slice(0, limit).map((passedProps: NameplateProps) => {
        const isCurrentUser = passedProps.shape === 'circle';
        return <Nameplate
          name={passedProps.name}
          shape={passedProps.shape}
          key={`${passedProps.name}-${passedProps.shape}`}
          highlight={isCurrentUser}
          expanded={isCurrentUser && expandCurrentUser}
          buttonOptions={!isCurrentUser && buttonOptions}
        />;
      })}
      {names.length > limit &&
                <Overflow
                  items={names.slice(limit).map(props => props.name)}
                  value={names.length - limit}
                />}
    </>
  );
}

export default NameplateGroup;
