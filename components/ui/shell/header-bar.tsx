'use client';

import type { PropsWithChildren } from 'react';

type HeaderBarProps = PropsWithChildren<{}>;

export const HeaderBar = ({ children }: HeaderBarProps) => {
  return (
    <div className="[grid-area:header] bg-gray-50 shadow-sm ">{children}</div>
  );
};
