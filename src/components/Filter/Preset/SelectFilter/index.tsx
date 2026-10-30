import { useEffect } from 'react';


import { SelectFilterFields } from './SelectFilterFields';
import { isSameValues, toValidValues } from './config';
import { Filter } from '../../Root';
import { useFilterDraft } from '../../useFilterDraft';
import { type SelectChipsItemType } from '../../../SelectChips';
import { IconComponentType } from '../../../../icons';

interface ISelectFilterBaseProps {
  title: string;
  icon: IconComponentType;
  items: SelectChipsItemType[];
}

interface ISelectFilterSingleProps extends ISelectFilterBaseProps {
  type?: 'single';
  /** 적용된(쿼리 파라미터 등) 값, 선택 없으면 null */
  value: string | null;
  onChange: (value: string | null) => void;
}

interface ISelectFilterMultipleProps extends ISelectFilterBaseProps {
  type: 'multiple';
  /** 적용된(쿼리 파라미터 등) 값들 */
  value: string[];
  onChange: (value: string[]) => void;
}

export type ISelectFilterProps =
  | ISelectFilterSingleProps
  | ISelectFilterMultipleProps;

export const SelectFilter = (props: ISelectFilterProps) => {
  const { title, icon, items } = props;
  const isMultiple = props.type === 'multiple';

  /**
   * single/multiple을 한 벌의 로직으로 다루려고 배열 기준으로 정규화한다.
   * union 좁히기를 여기서 한 번만 해두면 아래로는 배열만 오간다.
   */
  const { selectedValues, applyValues } =
    props.type === 'multiple'
      ? {
          selectedValues: props.value,
          applyValues: (values: string[]) => props.onChange(values),
        }
      : {
          selectedValues: props.value ? [props.value] : [],
          applyValues: (values: string[]) => props.onChange(values[0] ?? null),
        };

  /**
   * 쿼리 파라미터 등 외부에서 items에 없는 값이 들어올 수 있다 — 그대로 두면
   * 칩만 active로 뜨고 패널엔 아무것도 선택되지 않으므로, 없는 값으로
   * 취급해서 렌더링하고 부모의 실제 상태도 정리한다.
   */
  const validValues = toValidValues(items, selectedValues);

  useEffect(() => {
    if (!isSameValues(selectedValues, validValues)) applyValues(validValues);
  }, [props.value]);

  const { actionsRef, dropdownProps } = useFilterDraft();

  return (
    <Filter
      active={validValues.length > 0}
      title={title}
      onRemoveFilter={() => applyValues([])}
    >
      <Filter.Chip icon={icon} />
      <Filter.Dropdown {...dropdownProps}>
        <SelectFilterFields
          isMultiple={isMultiple}
          items={items}
          selectedValues={validValues}
          onApply={applyValues}
          actionsRef={actionsRef}
        />
      </Filter.Dropdown>
    </Filter>
  );
};
