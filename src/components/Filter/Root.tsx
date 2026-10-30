import { Children, isValidElement, ReactNode } from 'react';

import { Popover } from '../Popover';
import { FilterProvider } from './context';
import { FilterChip } from './FilterChip';
import { FilterDropdown } from './FilterDropdown';

interface IFilterProps {
  active?: boolean;
  /** 칩 라벨과 드롭다운 제목에 함께 쓰인다 */
  title: string;
  onRemoveFilter?: () => void;
  children: ReactNode;
}

const FilterRoot = ({
  active,
  title,
  onRemoveFilter,
  children,
}: IFilterProps) => {
  let chipElement: ReactNode = null;
  const panelChildren: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === FilterChip) {
      chipElement = child;
    } else {
      panelChildren.push(child);
    }
  });

  return (
    <FilterProvider active={active} title={title} onRemoveFilter={onRemoveFilter}>
      <Popover align="start">
        <Popover.Trigger>{chipElement}</Popover.Trigger>
        {panelChildren}
      </Popover>
    </FilterProvider>
  );
};

export const Filter = Object.assign(FilterRoot, {
  Chip: FilterChip,
  Dropdown: FilterDropdown,
});
