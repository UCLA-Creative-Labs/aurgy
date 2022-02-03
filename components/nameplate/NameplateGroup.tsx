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
  limit,
}: NameplateGroupProps): JSX.Element {
  limit = limit ?? names.length;

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
      {names.length > limit && <Overflow value={names.length - limit} />}
    </>
  );
}

export default NameplateGroup;
