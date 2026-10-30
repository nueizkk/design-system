import { useState } from 'react';

import { SelectChip } from './SelectChip';

export interface SelectChipsItemType {
  label: string;
  value: string;
}

interface ISelectChipsSingleProps {
  type?: 'single';
  items: SelectChipsItemType[];
  /** null은 "controlled인데 선택 없음", undefined는 uncontrolled를 뜻한다 */
  value?: string | null;
  defaultValue?: string;
  onSelect?: (value: string) => void;
}

interface ISelectChipsMultipleProps {
  type: 'multiple';
  items: SelectChipsItemType[];
  value?: string[];
  defaultValue?: string[];
  onSelect?: (value: string[]) => void;
}

export type ISelectChipsProps =
  | ISelectChipsSingleProps
  | ISelectChipsMultipleProps;

export const SelectChips = (props: ISelectChipsProps) => {
  const [singleValue, setSingleValue] = useState<string | undefined>(
    props.type !== 'multiple' ? props.defaultValue : undefined,
  );
  const [multipleValue, setMultipleValue] = useState<string[]>(
    props.type === 'multiple' ? (props.defaultValue ?? []) : [],
  );

  /**
   * value가 주어지면 controlled(외부 상태를 그대로 따름), 안 주어지면 위 내부
   * state를 uncontrolled 기본값으로 쓴다. `?? `가 아니라 undefined 여부로
   * 가르는 건, null을 "선택 없음"으로 그대로 반영하기 위해서다 — `??`면
   * null일 때 내부 state로 되돌아가 직전 선택이 되살아난다.
   */
  const resolvedSingleValue =
    props.type !== 'multiple'
      ? props.value !== undefined
        ? props.value
        : singleValue
      : undefined;
  const resolvedMultipleValue =
    props.type === 'multiple' ? (props.value ?? multipleValue) : [];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {props.items.map((item) => {
        const active =
          props.type === 'multiple'
            ? resolvedMultipleValue.includes(item.value)
            : resolvedSingleValue === item.value;

        const handleClick = () => {
          if (props.type === 'multiple') {
            const next = active
              ? resolvedMultipleValue.filter((value) => value !== item.value)
              : [...resolvedMultipleValue, item.value];

            setMultipleValue(next);
            props.onSelect?.(next);
            return;
          }

          setSingleValue(item.value);
          props.onSelect?.(item.value);
        };

        return (
          <SelectChip
            key={item.value}
            label={item.label}
            active={active}
            onClick={handleClick}
          />
        );
      })}
    </div>
  );
};
