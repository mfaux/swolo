'use client';

import type { PropsWithChildren } from 'react';

type HeaderBarProps = PropsWithChildren<{}>;

export const HeaderBar = ({ children }: HeaderBarProps) => {
  return <div className="shadow-sm ">{children}</div>;
};
