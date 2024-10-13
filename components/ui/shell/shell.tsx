import type { PropsWithChildren } from 'react';

type ShellProps = PropsWithChildren<{}>;

export const Shell = ({ children }: ShellProps) => {
  return (
    <div className="grid [grid-template-areas:'header_header''actionbar_main'] grid-cols-[auto_1fr] grid-rows-[auto_1fr] h-screen">
      {children}
    </div>
  );
};
