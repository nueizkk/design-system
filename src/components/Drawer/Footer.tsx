import { ReactNode } from 'react';

interface IDrawerFooterProps {
  children: ReactNode;
}

export function DrawerFooter({ children }: IDrawerFooterProps) {
  return <div className="shrink-0">{children}</div>;
}
