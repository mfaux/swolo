'use client';

import type { PropsWithChildren } from 'react';

type HeaderBarProps = PropsWithChildren<{}>;

export const Main = ({ children }: HeaderBarProps) => {
  return <div className="[grid-area:main] grid p-4">{children}</div>;
};
