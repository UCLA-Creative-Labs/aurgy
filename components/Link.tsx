import NextLink from 'next/link';
import React from 'react';

export interface LinkProps {
  href: string;
  children: JSX.Element;
}

export default function Link({href, children}: LinkProps): JSX.Element {
  return (
    <NextLink href={href}>
      <a>{children}</a>
    </NextLink>
  );
}
