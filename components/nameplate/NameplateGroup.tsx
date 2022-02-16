import React from 'react';
import Nameplate, {NameplateProps, Overflow} from './Nameplate';

export interface NameplateGroupProps {
  names: NameplateProps[];
  expandCurrentUser?: boolean;
  limit?: number;
}

function NameplateGroup({
  names,
  expandCurrentUser = false,
  limit: propLimit,
}: NameplateGroupProps): JSX.Element {
  const limit = propLimit ?? names.length;

  return (
    <>
      {names.slice(0, limit).map(passedProps =>
        <Nameplate
          name={passedProps.name}
          shape={passedProps.shape}
          highlight={passedProps.shape === 'circle'}
          expanded={passedProps.shape === 'circle' && expandCurrentUser}
          key={`${passedProps.name}-${passedProps.shape}`}
        />,
      )}
      {names.length > limit &&
                <Overflow
                  items={names.slice(limit).map(props => props.name)}
                  value={names.length - limit}
                />}
    </>
  );
}

export default NameplateGroup;
