import { useState, type MutableRefObject } from 'react';

import { getDraftValues, type IFilterInputItem } from './config';
import { Input } from '../../../Input';
import { type IDraftActions } from '../../useFilterDraft';

interface IInputFilterFieldsProps {
  inputs: IFilterInputItem[];
  actionsRef: MutableRefObject<IDraftActions>;
}

/**
 * Filter.Dropdown의 children이라 패널이 닫히면(Popover가 조건부 렌더)
 * 통째로 언마운트되고, 다시 열릴 때 draft가 그 시점의 적용값으로 새로
 * 초기화된다 — 완료/초기화 없이 닫아도 다음에 열면 항상 적용된 값에서 다시
 * 시작한다. "완료"를 누르면 각 인풋의 onChange에 자기 draft 값을 넣어준다.
 */
export const InputFilterFields = ({
  inputs,
  actionsRef,
}: IInputFilterFieldsProps) => {
  const [draftValues, setDraftValues] = useState(() =>
    getDraftValues(inputs, ({ value }) => value),
  );

  actionsRef.current = {
    reset: () => setDraftValues(getDraftValues(inputs, () => '')),
    apply: () =>
      inputs.forEach(({ name, onChange }) => onChange(draftValues[name] ?? '')),
  };

  return (
    /**
     * 인풋 묶음 사이 12px. Figma 복수 조건 예시(`34978:24319`)의 body 슬롯이
     * 144px이고, 라벨+인풋 묶음이 66px이라 `66 + 12 + 66`이다.
     */
    <div className="flex flex-col gap-3">
      {inputs.map(({ value, onChange, ...inputProps }) => (
        <Input
          key={inputProps.name}
          size="sm"
          {...inputProps}
          value={draftValues[inputProps.name] ?? ''}
          onChange={(e) =>
            setDraftValues((prev) => ({
              ...prev,
              [inputProps.name]: e.target.value,
            }))
          }
        />
      ))}
    </div>
  );
};
