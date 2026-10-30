import { MouseEvent, MouseEventHandler, ReactNode } from 'react';

import { cva } from 'class-variance-authority';
import { TokenSemanticColorType } from 'tokens';

import {
  ButtonVariantType,
  colorStyle,
  SizeType,
  spinnerColorStyle,
} from './config';
import { TailSpinner } from '../Loading/TailSpinner';
import { IconComponentType, IconSizeType } from '../../icons';
import { CursorType } from '../types/cursor';
import { cn } from '../utils/cn';

interface IButtonBaseProps {
  variant?: ButtonVariantType;
  size: SizeType;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement | SVGSVGElement>;
  disabled?: boolean;
  fullWidth?: boolean;
}

/**
 * leftIcon/rightIcon을 동시에 못 받게 막아둠 — isLoading이 둘 중 존재하는
 * 아이콘 자리를 스피너로 대체하는 방식이라, 둘 다 있으면 스피너 두 개가 동시에 뜬다.
 */
type IButtonProps = IButtonBaseProps &
  (
    | { leftIcon?: IconComponentType; rightIcon?: never }
    | { leftIcon?: never; rightIcon?: IconComponentType }
  );

export const Button = ({
  variant = 'primary',
  size,
  children,
  leftIcon,
  rightIcon,
  type = 'button',
  isLoading = false,
  onClick,
  disabled = false,
  fullWidth,
  ...props
}: IButtonProps) => {
  const fullStatus = isLoading ? 'isLoading' : disabled ? 'disabled' : 'default';
  const cursor: CursorType =
    fullStatus === 'isLoading'
      ? 'wait'
      : fullStatus === 'disabled'
        ? 'not-allowed'
        : 'pointer';
  const iconColor: TokenSemanticColorType = disabled
    ? 'label-disable'
    : colorStyle[variant];
  const spinnerColor = disabled ? 'primary' : spinnerColorStyle[variant];
  const iconSize: Extract<IconSizeType, 'md' | 'lg'> = size === 'lg' ? 'lg' : 'md';

  const handleClick = (
    event: MouseEvent<HTMLButtonElement | SVGSVGElement>,
  ) => {
    if (disabled || isLoading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  };

  /** 클릭은 감싸는 <button>이 받는다 — 아이콘에 따로 달면 이중 호출이 된다. */
  const renderIcon = (SlotIcon: IconComponentType) => (
    <SlotIcon size={iconSize} color={iconColor} cursor={cursor} />
  );

  const spinner = <TailSpinner color={spinnerColor} size={iconSize} />;

  return (
    <div
      className={cn(
        ContainerVariants({ status: fullStatus, variant, size }),
        fullWidth && 'w-full',
      )}
      {...props}
    >
      <button
        className={ButtonVariants({ status: fullStatus, size })}
        type={type}
        disabled={disabled || isLoading}
        onClick={handleClick}
      >
        {/**
         * isLoading이면 아이콘이 있는 자리를 스피너로 대체하고, 아이콘이
         * 아예 없으면 기본 위치인 좌측에 스피너를 띄운다.
         */}
        {leftIcon && (isLoading ? spinner : renderIcon(leftIcon))}
        {!leftIcon && !rightIcon && isLoading && spinner}
        {children}
        {rightIcon && (isLoading ? spinner : renderIcon(rightIcon))}
      </button>
    </div>
  );
};

const ContainerVariants = cva('relative shadow-100', {
  variants: {
    variant: {
      primary: '',
      outline: '',
      secondary: '',
    },
    status: {
      isLoading: 'cursor-wait',
      default: 'cursor-pointer',
      disabled:
        'cursor-not-allowed bg-interaction-disable border border-line-alternative text-label-disable',
    },
    size: {
      sm: 'rounded-sm w-fit typo-body-2 after:rounded-sm h-[40px]',
      md: 'rounded-sm w-fit typo-body-1 after:rounded-sm h-[48px]',
      lg: 'rounded-sm w-fit typo-body-1 after:rounded-sm h-[56px]',
    },
  },
  compoundVariants: [
    {
      status: ['default', 'isLoading'],
      className: 'interaction',
    },
    {
      status: ['default', 'isLoading'],
      variant: 'primary',
      className: 'bg-primary-normal text-static-white',
    },
    {
      status: ['default', 'isLoading'],
      variant: 'outline',
      className:
        'bg-background-normal border-primary-normal border text-primary-normal',
    },
    {
      status: ['default', 'isLoading'],
      variant: 'secondary',
      className: 'bg-background-normal text-label-normal',
    },
  ],
});

const ButtonVariants = cva(
  'flex items-center justify-center w-full h-full gap-2 whitespace-nowrap bg-transparent',
  {
    variants: {
      status: {
        isLoading: 'cursor-wait',
        default: 'cursor-pointer',
        disabled: 'cursor-not-allowed',
      },
      size: {
        sm: 'px-3',
        md: 'px-4',
        lg: 'px-5',
      },
    },
  },
);
