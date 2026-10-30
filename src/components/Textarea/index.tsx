import {
  FocusEventHandler,
  forwardRef,
  TextareaHTMLAttributes,
  useState,
} from 'react';

import { cva } from 'class-variance-authority';

import { TextareaStatusType } from './config';
import { ErrorMessage } from '../ErrorMessage';
import { Text } from '../Text';
import { useStrings } from '../../i18n';

interface ITextareaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'placeholder' | 'className'
  > {
  /** 무엇을 적는 칸인지 늘 알려준다 — 비워 둘 수 없다. */
  placeholder: string;
  /** 상단에 노출할 라벨. 없으면 라벨 영역 자체가 렌더되지 않는다. */
  label?: string;
  error?: boolean;
  errorMessage?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, ITextareaProps>(
  (
    {
      label,
      error,
      errorMessage,
      maxLength,
      readOnly,
      onBlur,
      onChange,
      ...props
    },
    ref,
  ) => {
    const strings = useStrings();
    const [isFocused, setIsFocused] = useState(false);
    const [uncontrolledLength, setUncontrolledLength] = useState(
      // uncontrolled에서 defaultValue가 있으면 카운터가 0부터 시작하면 안 된다
      typeof props.defaultValue === 'string' ? props.defaultValue.length : 0,
    );

    /**
     * controlled면 value가 정본이다. 이전 구현은 `textareaRef.current?.value`를
     * effect 의존성에 두어 ref 변화로는 리렌더가 돌지 않아 카운터가 밀렸다.
     */
    const contentLength =
      typeof props.value === 'string' ? props.value.length : uncontrolledLength;

    const getStatus = (): TextareaStatusType => {
      if (props.disabled) return 'disabled';
      if (error) return 'error';
      if (readOnly) return 'readOnly';
      if (isFocused) return 'focus';
      return 'default';
    };

    /** 네이티브 maxLength를 그대로 쓴다. 0도 유효한 제한이라 falsy 판정은 안 된다. */
    const hasCounter = maxLength !== undefined;

    /** Input과 같은 규칙 — 테두리가 에러일 때만 메시지를 띄운다. */
    const hasErrorMessage = !!error && !!errorMessage;

    const handleBlur: FocusEventHandler<HTMLTextAreaElement> = (e) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <Text variant="caption-1" color="label-normal">
            {label}
          </Text>
        )}
        <textarea
          {...props}
          ref={ref}
          readOnly={readOnly}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onChange={(e) => {
            setUncontrolledLength(e.currentTarget.value.length);
            onChange?.(e);
          }}
          className={TextareaVariants({ status: getStatus() })}
        />
        {(hasErrorMessage || hasCounter) && (
          <div className="flex items-center">
            {error && errorMessage && (
              <ErrorMessage message={errorMessage} />
            )}
            {hasCounter && (
              <Text
                variant="caption-2"
                color="label-alternative"
                className="ml-auto"
              >
                {contentLength} / {maxLength} {strings['characters']}
              </Text>
            )}
          </div>
        )}
      </div>
    );
  },
);

/**
 * Figma(34422:20437)에 size 축이 없다 — 상하 패딩은 14px 단일이다.
 * 상태별 색은 Input과 동일한 규칙을 따른다.
 */
const TextareaVariants = cva(
  'h-[160px] w-full resize-none overflow-y-auto rounded-sm border px-4 py-3.5 typo-body-2 focus:outline-none',
  {
    variants: {
      status: {
        default: 'border-line-normal',
        focus: 'border-status-main-standby',
        disabled:
          'border-label-disable bg-interaction-disable text-label-disable',
        error: 'border-status-main-negative',
        readOnly: 'border-line-normal',
      },
    },
    compoundVariants: [
      {
        status: ['default', 'error', 'focus'],
        className:
          'bg-background-normal text-label-normal placeholder:text-label-assistive',
      },
      {
        /** 읽기 전용은 테두리가 default와 같아 글자색이 유일한 단서다(Input과 동일). */
        status: 'readOnly',
        className:
          'bg-background-normal text-label-alternative placeholder:text-label-assistive',
      },
    ],
    defaultVariants: { status: 'default' },
  },
);

export default Textarea;
