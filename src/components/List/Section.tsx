import * as Icon from '../../icons';
import { Option } from '../Option';
import { Text } from '../Text';
import { cn } from '../utils/cn';
import { IListAppearance, ListSectionType } from './types';

interface IListSectionProps extends Required<Omit<IListAppearance, 'gap'>> {
  section: ListSectionType;
  isOpen: boolean;
  selectedValue: string | null;
  onHeaderClick: () => void;
  onOptionSelect: (optionValue: string) => void;
}

export function ListSection({
  section,
  color,
  activeHeaderBackground,
  indent,
  isOpen,
  selectedValue,
  onHeaderClick,
  onOptionSelect,
}: IListSectionProps) {
  /** 하위 항목이 없으면 펼칠 것도 없다 — 쉐브론이 사라지고 헤더가 곧 선택이다. */
  const hasOptions = section.options.length > 0;
  /**
   * 헤더는 **자기 자신이 선택됐을 때만** 활성이다. 하위 항목을 가진 헤더는
   * 자식이 선택돼도 그대로 둔다 — 활성 표시는 선택된 그 한 줄에만 붙는다.
   */
  const isSelected = !hasOptions && section.value === selectedValue;
  const headerColor = isSelected ? 'primary-normal' : color;
  const SectionIcon = section.icon;
  const Chevron = isOpen ? Icon.ChevronUp : Icon.ChevronDown;

  return (
    <div className={cn('flex flex-col', hasOptions && isOpen && 'gap-0.5')}>
      <div
        onClick={onHeaderClick}
        className={cn(
          'relative flex w-full cursor-pointer items-center gap-4 px-4 py-2.5',
          activeHeaderBackground &&
            isSelected &&
            'bg-interaction-active rounded-sm',
        )}
      >
        {SectionIcon && <SectionIcon size="md" color={headerColor} />}
        <Text
          variant="body-2"
          weight="semibold"
          color={headerColor}
          className="flex-1"
        >
          {section.label}
        </Text>
        {hasOptions && <Chevron size="sm" color={headerColor} />}
      </div>
      {hasOptions && isOpen && (
        <div className="flex flex-col gap-0.5 p-1">
          {section.options.map((option) => (
            <Option
              key={option.value}
              value={option.value}
              size="sm"
              indent={indent}
              active={option.value === selectedValue}
              disabled={option.disabled}
              label={option.label}
              color={color}
              onClick={() => onOptionSelect(option.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
