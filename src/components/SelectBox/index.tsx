import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { cva } from 'class-variance-authority';

import { ErrorMessage } from '../ErrorMessage';
import { Popover } from '../Popover';
import * as Icon from '../../icons';
import { Text } from '../Text';
import { SelectBoxPanel } from './Panel';
import { SelectBoxOptionType, SelectBoxSizeType } from './types';

const triggerVariants = cva(
  'flex w-full items-center gap-4 rounded-sm border px-4 outline-none',
  {
    variants: {
      size: {
        sm: 'h-10 py-2.5',
        md: 'h-12 py-3',
        lg: 'h-14 py-4',
      },
      state: {
        disabled: 'bg-interaction-disable border-label-disable cursor-not-allowed',
        error: 'bg-background-overlay border-status-main-negative cursor-pointer',
        focused: 'bg-background-overlay border-status-main-standby cursor-pointer',
        default: 'bg-background-overlay border-line-normal cursor-pointer',
      },
    },
  },
);
const TYPO: Record<SelectBoxSizeType, 'body-2' | 'body-1'> = {
  sm: 'body-2',
  md: 'body-1',
  lg: 'body-1',
};
const ICON_SIZE: Record<SelectBoxSizeType, 'md' | 'lg'> = {
  sm: 'md',
  md: 'md',
  lg: 'lg',
};

interface ISelectBoxProps {
  size: SelectBoxSizeType;
  options: SelectBoxOptionType[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  loading?: boolean;
  onScrollEnd?: () => void;
  fieldLabel?: string;
}

export function SelectBox({
  size,
  options,
  value,
  defaultValue,
  onChange,
  placeholder = '선택',
  disabled = false,
  error = false,
  errorMessage,
  loading = false,
  onScrollEnd,
  fieldLabel,
}: ISelectBoxProps) {
  // active(파란 테두리)는 열림 여부가 아니라 실제 포커스 여부를 따른다 — 옵션을
  // 선택해 패널이 닫혀도 트리거 자체는 blur되기 전까지(예: 다른 곳 클릭) 포커스 상태 유지.
  const [isFocused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [alignEnd, setAlignEnd] = useState(false);
  const [panelMinWidth, setPanelMinWidth] = useState(0);
  const triggerRef = useRef<HTMLDivElement>(null);

  const selectedValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((o) => o.value === selectedValue);

  useEffect(() => {
    if (!triggerRef.current) return;
    const el = triggerRef.current;

    const updatePanelPosition = () => {
      const rect = el.getBoundingClientRect();
      setPanelMinWidth(rect.width);
      setAlignEnd(rect.right > window.innerWidth);
    };

    updatePanelPosition();

    // 트리거 폭이 리사이즈 등으로 바뀌면 패널도 다시 계산돼야 한다.
    const resizeObserver = new ResizeObserver(updatePanelPosition);
    resizeObserver.observe(el);
    window.addEventListener('resize', updatePanelPosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePanelPosition);
    };
  }, []);

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    // Popover.Trigger가 클릭으로만 토글하므로, 키보드 활성화는 네이티브 버튼처럼
    // 자기 자신에 클릭을 합성해 그 핸들러를 그대로 재사용한다.
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.currentTarget.click();
    }
  };

  const handleSelect = (optionValue: string) => {
    if (value === undefined) setInternalValue(optionValue);
    onChange?.(optionValue);
  };

  const typo = TYPO[size];
  const iconSize = ICON_SIZE[size];
  /**
   * 고른 값이 있으면 글자가 진해지고, 없으면 placeholder라 연하다 — `Input`의
   * default/filled와 같은 축이다. 쉐브론은 placeholder일 때만 한 단계 진한
   * `label-neutral`이고, 값이 생기면 글자와 같아진다(Figma `4369:8671`·`34402:23053`).
   */
  const hasValue = !!selectedOption;
  const textColor = disabled
    ? 'label-disable'
    : hasValue
      ? 'label-normal'
      : 'label-assistive';
  const chevronColor = disabled
    ? 'label-disable'
    : hasValue
      ? 'label-normal'
      : 'label-neutral';
  const SelectedIcon = selectedOption?.leftIcon;
  const triggerState = disabled
    ? 'disabled'
    : error
      ? 'error'
      : isFocused
        ? 'focused'
        : 'default';

  return (
    /**
     * 폭은 감싸는 쪽이 정한다 — `Input`·`Textarea`와 같다. Figma 문서가
     * "높이(폭 아님)는 사이즈별 고정값"이라 폭에 맞출 스펙이 없고, 예시도
     * 118·130으로 제각각이다(`34195:9006`).
     */
    <div className="flex w-full flex-col gap-2">
      {fieldLabel && (
        <Text variant="caption-1" color="label-normal">
          {fieldLabel}
        </Text>
      )}
      {/**
        * `fullWidth` — `Popover`는 기본이 `w-fit`이라 트리거가 내용 폭으로 줄어든다.
        * 폼 입력은 `Input`처럼 부모를 채워야 한다.
        */}
      <Popover
        align={alignEnd ? 'end' : 'start'}
        disabled={disabled}
        fullWidth
      >
        <Popover.Trigger>
          {({ isActive }) => {
            const Chevron = isActive ? Icon.ChevronUp : Icon.ChevronDown;

            return (
            <div
              ref={triggerRef}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-disabled={disabled}
              data-disabled={disabled}
              onKeyDown={handleTriggerKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={triggerVariants({ size, state: triggerState })}
            >
              {SelectedIcon && (
                <SelectedIcon size={iconSize} color={textColor} />
              )}
              <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                <Text
                  variant={typo}
                  color={textColor}
                  className="min-w-0 flex-1 truncate text-left"
                >
                  {selectedOption?.label ?? placeholder}
                </Text>
                <Chevron size="md" color={chevronColor} />
              </div>
            </div>
            );
          }}
        </Popover.Trigger>
        <SelectBoxPanel
          size={size}
          options={options}
          selectedValue={selectedValue}
          onSelect={handleSelect}
          loading={loading}
          onScrollEnd={onScrollEnd}
          minWidth={panelMinWidth}
        />
      </Popover>
      {error && errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
}
