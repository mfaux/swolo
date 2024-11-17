// Ensure the file is treated as a module
export {};

// type definitions for SVG files
declare module '*.svg' {
  import React from 'react';
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare global {
  // Omit, plus ensuring keys exist in T
  type StrictOmit<T, K extends keyof T> = Omit<T, K>;
}
