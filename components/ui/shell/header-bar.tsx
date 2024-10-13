'use client';

import type { PropsWithChildren } from 'react';

type HeaderBarProps = PropsWithChildren<{}>;

export const HeaderBar = ({ children }: HeaderBarProps) => {
  return <div className="[grid-area:header] bg-yellow-200">{children}</div>;
};
