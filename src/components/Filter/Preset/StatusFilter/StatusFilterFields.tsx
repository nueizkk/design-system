import { useState, type MutableRefObject } from 'react';

import {
  collapseValues,
  collectLeafValues,
  expandValues,
  getCheckedState,
  type IStatusOption,
} from './config';
import { StatusOptionNode } from './StatusOptionNode';
import { type IDraftActions } from '../../useFilterDraft';

interface IStatusFilterFieldsProps {
  options: IStatusOption[];
  value: string[];
  onChange: (value: string[]) => void;
  actionsRef: MutableRefObject<IDraftActions>;
}

/**
 * Filter.Dropdown의 children이라 패널이 닫히면(Popover가 조건부 렌더)
 * 통째로 언마운트되고, 다시 열릴 때 draft가 그 시점의 value로 새로
 * 초기화된다 — 완료/초기화 없이 닫아도 다음에 열면 항상 적용된 값에서 다시
 * 시작한다.
 *
 * draft는 항상 말단 값만 담는 형태로 유지하고, collapsible 묶음 값과의 변환은
 * 바깥과 맞닿는 두 지점(초기화 시 expand, 완료 시 collapse)에서만 한다.
 */
export const StatusFilterFields = ({
  options,
  value,
  onChange,
  actionsRef,
}: IStatusFilterFieldsProps) => {
  const [draftValue, setDraftValue] = useState(() =>
    expandValues(options, value),
  );

  /**
   * 하위 말단들이 전부 선택돼 있으면 모두 해제하고, 그 외(일부만 선택 =
   * partial, 혹은 전부 미선택)에는 모두 선택한다.
   */
  const handleToggle = (option: IStatusOption) => {
    const leaves = collectLeafValues(option);
    const isAllChecked = getCheckedState(option, draftValue) === true;

    setDraftValue((prev) =>
      isAllChecked
        ? prev.filter((v) => !leaves.includes(v))
        : Array.from(new Set([...prev, ...leaves])),
    );
  };

  actionsRef.current = {
    reset: () => setDraftValue([]),
    apply: () => onChange(collapseValues(options, draftValue)),
  };

  return (
    <div className="flex flex-col gap-5">
      {options.map((option) => (
        <StatusOptionNode
          key={option.value}
          option={option}
          checkedValues={draftValue}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
};
