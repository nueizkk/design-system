import { Chip } from '../Chip';
import { usePopover } from '../Popover/context';
import * as Icon from '../../icons';
import { IconComponentType } from '../../icons';
import { useFilterContext } from './context';

export interface IFilterChipProps {
  icon: IconComponentType;
}

/**
 * Root(Filter)가 children에서 이 엘리먼트를 찾아 Popover.Trigger 안에 그대로
 * 넣어준다 — Popover가 트리거를 인식하려면 Popover.Trigger가 Popover의 직계
 * 자식이어야 해서, Root가 직접 넣어야 한다. title/active/onRemoveFilter처럼
 * Filter.Dropdown과 공유하는 값은 전부 FilterContext에서 읽는다.
 */
export const FilterChip = ({ icon }: IFilterChipProps) => {
  const context = useFilterContext();
  const title = context?.title ?? '';
  const active = context?.active;
  const onRemoveFilter = context?.onRemoveFilter;

  const { close } = usePopover();

  /**
   * Chip의 xMark는 클릭이 트리거까지 새지 않도록 stopPropagation하므로,
   * 패널이 열린 채 필터만 사라지는 걸 막기 위해 여기서 직접 닫아준다.
   */
  const handleRemoveFilter = () => {
    onRemoveFilter?.();
    close();
  };

  return (
    <Chip
      leftIcon={icon}
      rightIcon={active ? Icon.XMark : null}
      active={active}
      onRightIconClick={handleRemoveFilter}
    >
      {title}
    </Chip>
  );
};
