'use client';

import { ArrowUp } from 'lucide-react';
import { Button, ButtonProps } from './button';

const SubmitButton = (props: ButtonProps & { isPending: boolean }) => {
  console.log('SubmitButton');
  return (
    <Button type="submit" aria-disabled={props.isPending} {...props}>
      <ArrowUp />
    </Button>
  );
};

export { SubmitButton };
