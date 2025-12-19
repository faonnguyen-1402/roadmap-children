'use client';

import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

export function ChoiceButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className='w-full justify-start text-left h-auto py-4 rounded-2xl whitespace-normal'
      variant='secondary'
    >
      {children}
    </Button>
  );
}
