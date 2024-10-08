"use client";

import type { PropsWithChildren } from "react";

type HeaderBarProps = PropsWithChildren<{
  className?: string;
}>;

export const HeaderBar = ({ children, className }: HeaderBarProps) => {
  return <div className={className}>{children}</div>;
};
