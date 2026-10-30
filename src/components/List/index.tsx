import { useState } from 'react';

import { cn } from '../utils/cn';

import { ListSection } from './Section';
import { IListAppearance, ListGapType, ListSectionType } from './types';

export type {
  IListAppearance,
  ListGapType,
  ListOptionType,
  ListSectionType,
} from './types';

interface IListProps extends IListAppearance {
  sections: ListSectionType[];
  defaultOpenValue?: string;
  defaultSelectedValue?: string;
  onOpenChange?: (openValue: string | null) => void;
  onSelect?: (sectionValue: string, optionValue: string) => void;
}

const GAP: Record<ListGapType, string> = {
  none: '',
  md: 'gap-3',
};

/**
 * **비공개 프리미티브.** `components/index.ts`에서 내보내지 않는다 —
 * 소비앱은 `Accordion`이나 `Sidebar`를 쓴다.
 *
 * "접히는 행들의 목록"이다. `Accordion`은 여기에 기본값만 얹은 얇은 래퍼이고,
 * `Sidebar`는 간격·색·선택 배경을 자기 기준으로 지정해 쓴다. 사이드바 요구가
 * `Accordion`의 공개 API로 새지 않게 하는 것이 분리의 이유다.
 */
export function List({
  sections,
  defaultOpenValue,
  defaultSelectedValue,
  onOpenChange,
  onSelect,
  color = 'label-normal',
  gap = 'none',
  activeHeaderBackground = false,
  indent = false,
}: IListProps) {
  const [openValue, setOpenValue] = useState<string | null>(
    defaultOpenValue ?? null,
  );
  const [selectedValue, setSelectedValue] = useState<string | null>(
    defaultSelectedValue ?? null,
  );

  const handleHeaderClick = (section: ListSectionType) => {
    /** 하위 항목이 없는 섹션은 펼칠 게 없으므로 헤더 자체가 선택이다. */
    if (!section.options.length) {
      setSelectedValue(section.value);
      onSelect?.(section.value, section.value);
      return;
    }

    const next = openValue === section.value ? null : section.value;
    setOpenValue(next);
    onOpenChange?.(next);
  };

  const handleOptionSelect = (sectionValue: string, optionValue: string) => {
    setSelectedValue(optionValue);
    onSelect?.(sectionValue, optionValue);
  };

  return (
    <div className={cn('flex flex-col', GAP[gap])}>
      {sections.map((section) => (
        <ListSection
          key={section.value}
          section={section}
          color={color}
          activeHeaderBackground={activeHeaderBackground}
          indent={indent}
          isOpen={openValue === section.value}
          selectedValue={selectedValue}
          onHeaderClick={() => handleHeaderClick(section)}
          onOptionSelect={(optionValue) =>
            handleOptionSelect(section.value, optionValue)
          }
        />
      ))}
    </div>
  );
}
