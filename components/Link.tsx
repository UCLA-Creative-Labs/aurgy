import NextLink from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';

export interface LinkProps {
  href: string;
  activeClassName?: string;
  children: string;
}

export default function Link({href, activeClassName, children}: LinkProps): JSX.Element {
  // No built-in activeClassName prop for Next links:
  // https://github.com/vercel/next.js/tree/canary/examples/active-class-name

  const {asPath} = useRouter();
  const className = asPath === href && activeClassName != null ? activeClassName : '';

  return (
    <NextLink href={href}>
      <a className={className}>{children}</a>
    </NextLink>
  );
}
