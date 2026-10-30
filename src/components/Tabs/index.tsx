import { ReactNode } from 'react';

import { Tab, TabItemType } from './Tab';

interface ITabsProps {
  items: TabItemType[];
  children?: ReactNode;
}

export const Tabs = ({ items, children }: ITabsProps) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          {items.map((item) => (
            <Tab key={item.label} {...item} />
          ))}
        </div>
        {children}
      </div>
      <hr className="border-line-normal h-[1px] w-full" />
    </div>
  );
};
