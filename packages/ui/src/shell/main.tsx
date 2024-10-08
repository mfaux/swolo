"use client";

import type { PropsWithChildren } from "react";

type HeaderBarProps = PropsWithChildren<{}>;

export const Main = ({ children }: HeaderBarProps) => {
  return <div className="grid place-content-center h-screen">{children}</div>;
};
