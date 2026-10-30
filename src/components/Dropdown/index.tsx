import { ReactNode } from 'react';

import { Popover } from '../Popover';
import { AlignType } from '../Popover/Root';
import { DropdownOptionType } from './config';
import { DropdownPanel } from './Panel';

interface IDropdownProps {
  children: ReactNode;
  options: DropdownOptionType[][];
  align?: AlignType;
  openOnHover?: boolean;
  disabled?: boolean;
}

function DropdownRoot({ children, options, ...popoverProps }: IDropdownProps) {
  return (
    <Popover {...popoverProps}>
      {children}
      <DropdownPanel options={options} />
    </Popover>
  );
}

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: Popover.Trigger,
});
