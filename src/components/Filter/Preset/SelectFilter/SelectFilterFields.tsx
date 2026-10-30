import { useState, type MutableRefObject } from 'react';

import { SelectChips, type SelectChipsItemType } from '../../../SelectChips';
import { type IDraftActions } from '../../useFilterDraft';

interface ISelectFilterFieldsProps {
  isMultiple: boolean;
  items: SelectChipsItemType[];
  /** single이어도 내부에서는 길이 0~1 배열로 다룬다 */
  selectedValues: string[];
  onApply: (values: string[]) => void;
  actionsRef: MutableRefObject<IDraftActions>;
}

/**
 * Filter.Dropdown의 children이라 패널이 닫히면(Popover가 조건부 렌더)
 * 통째로 언마운트되고, 다시 열릴 때 draft가 그 시점의 적용값으로 새로
 * 초기화된다 — 완료/초기화 없이 닫아도 다음에 열면 항상 적용된 값에서 다시
 * 시작한다.
 *
 * single/multiple을 한 벌의 로직으로 다루려고 draft는 항상 배열로 들고,
 * single 여부는 SelectChips에 넘길 때와 위로 돌려줄 때만 갈린다.
 */
export const SelectFilterFields = ({
  isMultiple,
  items,
  selectedValues,
  onApply,
  actionsRef,
}: ISelectFilterFieldsProps) => {
  const [draftValues, setDraftValues] = useState(selectedValues);

  actionsRef.current = {
    reset: () => setDraftValues([]),
    apply: () => onApply(draftValues),
  };

  return isMultiple ? (
    <SelectChips
      type="multiple"
      items={items}
      value={draftValues}
      onSelect={setDraftValues}
    />
  ) : (
    <SelectChips
      items={items}
      value={draftValues[0] ?? null}
      onSelect={(value) => setDraftValues([value])}
    />
  );
};
