import { InputHTMLAttributes, useEffect, useState } from 'react';

import { cva } from 'class-variance-authority';

import * as Icon from '../../icons';

interface ICheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    /**
     * `className`을 뺀다 — 시각 스펙을 밖에서 덮는 통로라 Figma 완전싱크와
     * 충돌한다. `Input`·`Textarea`도 같은 방식으로 막았다.
     */
    'checked' | 'defaultChecked' | 'className'
  > {
  // 하위 항목 중 일부만 선택된 상태를 표시하는 'partial'을 포함한 tri-state
  checked?: boolean | 'partial';
  defaultChecked?: boolean | 'partial';
  onCheck?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox = ({
  onCheck,
  checked: checkedProp,
  defaultChecked,
  disabled,
  ...props
}: ICheckboxProps) => {
  const [checked, setChecked] = useState<boolean | 'partial'>(
    checkedProp ?? defaultChecked ?? false,
  );

  useEffect(() => {
    if (checkedProp == null) return;
    setChecked(checkedProp);
  }, [checkedProp]);

  const isPartial = checked === 'partial';
  const isFilled = checked === true || isPartial;

  return (
    <label
      className={checkboxVariants({
        disabled: !!disabled,
        active: isFilled,
      })}
    >
      {isPartial ? (
        <Icon.Minus
          data-testid="checkboxPartialIcon"
          size="sm"
          cursor="pointer"
          color="static-white"
        />
      ) : (
        checked === true && (
          <Icon.Check
            data-testid="checkboxCheckIcon"
            size="sm"
            cursor={disabled ? 'default' : 'pointer'}
            color="static-white"
          />
        )
      )}
      <input
        className="hidden"
        type="checkbox"
        onChange={() => {
          // partial → true(전체 선택), true → false, false → true
          const next = checked !== true;
          onCheck?.(next);
          setChecked(checkedProp != null ? checkedProp : next);
        }}
        checked={isFilled}
        disabled={disabled}
        {...props}
      />
    </label>
  );
};

const checkboxVariants = cva(
  'min-w-[20px] min-h-[20px] h-[20px] flex items-center justify-center rounded-xs select-none',
  {
    variants: {
      active: {
        true: '',
        false: '',
      },
      disabled: {
        true: 'cursor-default border-[1.5px] border-line-normal bg-interaction-disable',
        false: 'cursor-pointer',
      },
    },
    compoundVariants: [
      {
        active: true,
        disabled: false,
        className: 'border border-primary-normal bg-primary-normal',
      },
      {
        active: false,
        disabled: false,
        className: 'border-[1.5px] border-line-normal bg-static-white',
      },
    ],
  },
);
