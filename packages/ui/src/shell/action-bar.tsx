"use client";
import { cn } from "../utls/lib";
import styles from "./action-bar.module.css";
import type { PropsWithChildren } from "react";

type ActionBarProps = PropsWithChildren<{
  className?: string;
}>;

export const ActionBar = ({ children, className }: ActionBarProps) => {
  return <div className={cn(className, styles.bg)}>{children}</div>;
};
