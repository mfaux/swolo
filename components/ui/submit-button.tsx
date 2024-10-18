'use client';

import { ArrowUp } from 'lucide-react';
import { Button, ButtonProps } from './button';

type SubmitButtonProps = ButtonProps & { isPending: boolean };

const SubmitButton = ({ isPending, ...rest }: SubmitButtonProps) => {
  return (
    <Button type="submit" aria-disabled={isPending} {...rest}>
      <ArrowUp />
    </Button>
  );
};

export { SubmitButton };
