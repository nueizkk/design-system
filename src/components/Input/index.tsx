import React, {
  ChangeEvent,
  FocusEventHandler,
  forwardRef,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { cva } from "class-variance-authority";

import { inputColorStyle, InputSizeType, StatusType } from "./config";
import * as Icon from '../../icons';
import { IconComponentType, IconSizeType } from '../../icons';
import { ErrorMessage } from "../ErrorMessage";
import { Text } from "../Text";
import { cn } from "../utils/cn";

import "./index.css";

interface IInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "className"
> {
  type?: HTMLInputTypeAttribute;
  label?: string;
  leftIcon?: IconComponentType;
  rightIcon?: IconComponentType;
  onRightIconClick?: () => void;
  size: InputSizeType;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  unit?: string;
  // true면 포커스와 무관하게 값이 있기만 하면 clear 버튼이 뜬다 — FileInput처럼
  // 타이핑/포커스 개념이 없는 소비처를 위한 옵션(기본은 기존처럼 포커스+값 둘 다 필요).
  clearOnValue?: boolean;
  // clear 버튼을 눌렀을 때 onChange와 별개로 호출된다.
  onClear?: () => void;
}

// 네이티브 <input type="...">처럼 text/password 모드를 한 컴포넌트가 겸한다 —
// type이 뭐냐에 따라 isPassword 분기로 렌더링·이벤트가 갈린다.
export const Input = forwardRef<HTMLInputElement, IInputProps>(
  (
    {
      label,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      size,
      type,
      required,
      error = false,
      errorMessage,
      onFocus,
      onBlur,
      unit,
      readOnly,
      disabled,
      onRightIconClick,
      onChange,
      clearOnValue = false,
      onClear,
      placeholder,
      value,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [passwordView, setPasswordView] = useState(false);
    const [hasTextValue, setHasTextValue] = useState(!!defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // controlled value는 실제 타이핑 없이도 바뀔 수 있다(FileInput처럼 외부에서
    // 값을 주입하는 경우) — 그런 변화도 filled 상태에 반영되도록 value를 직접 구독한다.
    useEffect(() => {
      if (value !== undefined) setHasTextValue(!!value);
    }, [value]);

    const isPassword = type === "password";

    // Figma의 'type' 상태(포커스+입력중)에서만 노출되는 clear 버튼 — disabled/readOnly에선 없음.
    // password는 clear와 무관한 별개 슬롯(눈 아이콘)이라 같이 뜬다. clearOnValue면
    // 포커스 여부와 무관하게 값만 있으면 노출한다(예: FileInput).
    const showClear =
      (isFocused || clearOnValue) && hasTextValue && !disabled && !readOnly;
    // Figma: leftIcon/rightIcon sm·md는 20px(md), lg는 24px(lg)
    const iconSize: IconSizeType = size === "lg" ? "lg" : "md";
    // clear는 unit/rightIcon과 별개의 슬롯이라 rightIcon 유무와 무관하게 독립적으로 뜬다.
    const showRightIconSlot = !!(RightIcon || isPassword);

    const status: StatusType = (() => {
      if (disabled) return "disabled";
      if (error) return "error";
      if (readOnly) return "readOnly";
      if (isFocused) return "focus";
      if (hasTextValue) return "filled";
      return "default";
    })();

    const inputType = () =>
      type === "password" && passwordView ? "text" : type;

    const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
      setIsFocused(true);
      onFocus && onFocus(e);
    };

    const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
      setIsFocused(false);
      onBlur && onBlur(e);
    };

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      setHasTextValue(!!e.target.value);
    };

    const handleClear = () => {
      const input = inputRef.current;
      if (!input) return;
      // React가 추적하는 value setter를 우회해 실제 DOM value를 바꾸고 input 이벤트를
      // 직접 발생시켜야 controlled/uncontrolled 양쪽 모두에서 onChange가 정상 호출된다.
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(input, "");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
      onClear?.();
    };

    const getRightIcon = () => {
      if (RightIcon)
        return (
          <RightIcon
            cursor={onRightIconClick ? "pointer" : "default"}
            onClick={onRightIconClick}
            color={inputColorStyle[status]}
            size={iconSize}
            data-testid="inputRightIcon"
          />
        );
      if (isPassword) {
        const PasswordToggleIcon = passwordView ? Icon.Eye : Icon.EyeSlash;
        return (
          <PasswordToggleIcon
            size={iconSize}
            color={inputColorStyle[status]}
            cursor="pointer"
            onClick={(e) => {
              /** label이 input으로 클릭을 넘기는 기본 동작을 막는다. */
              e.preventDefault();
              setPasswordView((prev) => !prev);
            }}
            data-testid="inputRightIcon"
          />
        );
      }
    };

    return (
      <div className="relative flex w-full flex-col gap-2">
        {label && (
          <Text variant="caption-1" color="label-normal">
            {label}
          </Text>
        )}
        <label
          className={InputContainerVariants({
            inputSize: size,
            status,
          })}
        >
          {(() => {
            /** password 타입은 leftIcon 지정과 무관하게 자물쇠 아이콘이 우선한다. */
            const SlotIcon = isPassword ? Icon.Password : LeftIcon;
            return (
              SlotIcon && (
                <SlotIcon
                  size={iconSize}
                  color={inputColorStyle[status]}
                />
              )
            );
          })()}
          <input
            className={cn(InputVariants({ status }), "default-input")}
            type={inputType()}
            ref={inputRef}
            required={required}
            onFocus={handleFocus}
            onBlur={handleBlur}
            readOnly={readOnly}
            disabled={disabled}
            placeholder={placeholder}
            onChange={handleChangeInput}
            value={value}
            defaultValue={defaultValue}
            {...props}
          />
          {showClear && (
            <Icon.CircleXSolid
              size={iconSize}
              /**
               * 꽉 찬 원에 X가 구멍으로 뚫린 모양이다(`evenodd`). 색은 원에 칠해지고
               * X는 뒤 배경이 비쳐 흰색으로 보인다 — 링+X인 `CircleX`를 쓰면
               * 테두리와 X가 같은 회색이 되어 Figma와 달라진다.
               *
               * Figma 실측(#B2B2B2 = label-assistive) 고정색 — 상태별로 바뀌지 않는다.
               */
              color="label-assistive"
              cursor="pointer"
              // label의 input으로 클릭을 넘겨주는 기본 동작은 preventDefault로만
              // 막힌다 — 안 막으면 label 아래 input의 onClick(예: FileInput의
              // 파일 선택창 열기)까지 함께 발동한다. stopPropagation은 Input을
              // 감싸는 조상의 onClick(예: DateInput의 Popover.Trigger 토글)까지
              // 클릭이 새는 걸 막는다.
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClear();
              }}
              // mousedown 시점에 blur가 먼저 발생하면 isFocused가 꺼지며 이 버튼 자체가
              // 사라져 클릭이 무산된다(SelectBox 패널과 동일한 문제) — 포커스를 유지시킨다.
              onMouseDown={(e) => e.preventDefault()}
              data-testid="inputClearIcon"
            />
          )}
          {unit && (
            /** Figma: unit은 본문 텍스트와 같은 크기에 Bold만 붙는다 */
            <Text
              variant={size === "sm" ? "body-2" : "body-1"}
              weight="bold"
              color={inputColorStyle[status]}
            >
              {unit}
            </Text>
          )}
          {showRightIconSlot && getRightIcon()}
        </label>
        {error && errorMessage && (
          <ErrorMessage message={errorMessage} />
        )}
      </div>
    );
  },
);

const InputContainerVariants = cva(
  // border 대신 ring(box-shadow 기반)+ring-inset을 쓴다 — border는 레이아웃 박스에
  // 실제로 두께가 더해져서 padding과 별개로 높이를 2px(위아래 1px씩) 키우지만,
  // ring은 box-shadow라 레이아웃 크기에 전혀 영향을 안 줘서 Figma 패딩값을 그대로 쓸 수 있다.
  "px-4 ring-1 ring-inset rounded-sm flex items-center w-full gap-4",
  {
    variants: {
      inputSize: {
        lg: "py-4 typo-body-1",
        md: "py-3 typo-body-1",
        sm: "py-2.5 typo-body-2",
      },
      status: {
        default: "cursor-text",
        error: "cursor-text",
        disabled: "cursor-not-allowed",
        focus: "cursor-text",
        readOnly: "cursor-default",
        filled: "cursor-text",
      },
    },
    compoundVariants: [
      {
        status: "default",
        className: "ring-line-normal bg-background-normal",
      },
      {
        status: "error",
        className: "ring-status-main-negative bg-background-normal",
      },
      {
        status: "disabled",
        className: "ring-label-disable bg-interaction-disable",
      },
      {
        status: "focus",
        className: "ring-status-main-standby bg-background-normal",
      },
      {
        status: "readOnly",
        className: "ring-line-normal bg-background-normal",
      },
      {
        status: "filled",
        className: "ring-line-normal bg-background-normal",
      },
    ],
  },
);

const InputVariants = cva("outline-none border-none text-ellipsis w-full", {
  variants: {
    status: {
      default: "",
      error: "",
      disabled: "",
      focus: "",
      readOnly: "",
      filled: "",
    },
  },
  compoundVariants: [
    {
      status: ["default", "focus", "error", "filled"],
      className:
        "text-label-normal bg-background-normal default-input-default placeholder:text-label-assistive",
    },
    {
      status: "disabled",
      className:
        "text-label-disable bg-interaction-disable default-input-disabled placeholder:text-label-disable",
    },
    {
      status: "readOnly",
      className:
        "text-label-alternative bg-background-normal default-input-default placeholder:text-label-assistive cursor-default",
    },
  ],
});
