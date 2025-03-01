'use client';

import { ArrowUp } from 'lucide-react';
import { ComponentProps } from 'react';
import { Button } from './shadcn/button';

type SubmitButtonProps = ComponentProps<typeof Button> & { isPending: boolean };

const SubmitButton = ({ isPending, ...rest }: SubmitButtonProps) => {
  return (
    <Button type="submit" aria-disabled={isPending} {...rest}>
      <ArrowUp />
    </Button>
  );
};

export { SubmitButton };
