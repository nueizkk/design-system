import { useEffect } from 'react';


import {
  EMPTY_RANGE,
  getSubmitDisabled,
  toValidRange,
  type IDateRange,
} from './config';
import { DateFilterFields } from './DateFilterFields';
import { Filter } from '../../Root';
import { useFilterDraft } from '../../useFilterDraft';
import { IconComponentType } from '../../../../icons';

interface IDateFilterProps {
  title: string;
  icon: IconComponentType;
  /** 적용된(쿼리 파라미터 등) 구간 */
  value: IDateRange;
  onChange: (value: IDateRange) => void;
}

export const DateFilter = ({
  title,
  icon,
  value,
  onChange,
}: IDateFilterProps) => {
  /**
   * 형식이 깨진 값(예: 잘못 조작된 URL)은 없는 값으로 취급해서 렌더링하고,
   * 부모의 실제 상태도 정리한다.
   */
  const validValue = toValidRange(value);

  useEffect(() => {
    if (
      value.startDate !== validValue.startDate ||
      value.endDate !== validValue.endDate
    ) {
      onChange(validValue);
    }
  }, [value, onChange]);

  const { actionsRef, setDisableSubmit, dropdownProps } = useFilterDraft(
    getSubmitDisabled(validValue),
  );

  return (
    <Filter
      active={Boolean(validValue.startDate && validValue.endDate)}
      title={title}
      onRemoveFilter={() => onChange(EMPTY_RANGE)}
    >
      <Filter.Chip icon={icon} />
      <Filter.Dropdown {...dropdownProps}>
        <DateFilterFields
          value={validValue}
          onApply={onChange}
          actionsRef={actionsRef}
          onDisableSubmitChange={setDisableSubmit}
        />
      </Filter.Dropdown>
    </Filter>
  );
};
