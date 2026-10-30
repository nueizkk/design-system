import { useEffect } from 'react';


import { StatusFilterFields } from './StatusFilterFields';
import { isSameValues, toValidValues, type IStatusOption } from './config';
import { Filter } from '../../Root';
import { useFilterDraft } from '../../useFilterDraft';
import { IconComponentType } from '../../../../icons';

interface IStatusFilterProps {
  title: string;
  icon: IconComponentType;
  /** 깊이 제한 없이 중첩 가능한 옵션 트리 */
  options: IStatusOption[];
  /**
   * 적용된 말단 status 값 목록(다중 선택). 상위 노드 value는 담지 않는다.
   * options에 없는 값이 섞여 있으면 걸러내고 onChange로 정리한다.
   */
  value: string[];
  /** 완료를 누른 시점의 선택 목록 전체를 넘겨준다 */
  onChange: (value: string[]) => void;
}

export const StatusFilter = ({
  title,
  icon,
  options,
  value,
  onChange,
}: IStatusFilterProps) => {
  /**
   * 쿼리 파라미터 등 외부에서 options에 없는 값이 들어올 수 있다 — 그대로
   * 두면 칩만 active로 뜨고 패널엔 아무것도 체크되지 않으므로, 없는 값으로
   * 취급해서 렌더링하고 부모의 실제 상태도 정리한다.
   */
  const validValue = toValidValues(options, value);

  useEffect(() => {
    if (!isSameValues(value, validValue)) onChange(validValue);
  }, [value, onChange]);

  const { actionsRef, dropdownProps } = useFilterDraft();

  return (
    <Filter
      active={validValue.length > 0}
      title={title}
      onRemoveFilter={() => onChange([])}
    >
      <Filter.Chip icon={icon} />
      <Filter.Dropdown {...dropdownProps}>
        <StatusFilterFields
          options={options}
          value={validValue}
          onChange={onChange}
          actionsRef={actionsRef}
        />
      </Filter.Dropdown>
    </Filter>
  );
};
