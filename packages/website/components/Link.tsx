import NextLink from 'next/link';
import {useRouter} from 'next/router';
import React from 'react';

export interface LinkProps {
  href: string;
  activeClassName?: string;
  isDisabled?: boolean;
  children: React.ReactNode;
}

export default function Link({href, activeClassName, isDisabled, children}: LinkProps): JSX.Element {
  // No built-in activeClassName prop for Next links:
  // https://github.com/vercel/next.js/tree/canary/examples/active-class-name

  const {asPath} = useRouter();
  const className = asPath === href && activeClassName != null ? activeClassName : '';

  const base = <a className={className}>{children}</a>;
  return !isDisabled ? <NextLink href={href}>{base}</NextLink> : base;
}
