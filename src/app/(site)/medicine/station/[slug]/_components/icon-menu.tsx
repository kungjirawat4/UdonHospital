import type { ReactNode } from 'react';

import { cn } from '@/libs/utils';

type MenuIconProps = {
  icon: ReactNode;
  text: string;
  className?: string;
};

export default function IconMenu({ className, icon, text }: MenuIconProps) {
  return (
    <div
      className={cn(
        'flex flex-row text-center items-center justify-center space-x-2',
        className,
      )}
    >
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  );
}
