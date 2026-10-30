import { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { IconComponentType } from '../../icons';

export type ChipSizeType = 'md' | 'sm';

/**
 * `className`을 뺀다 — 시각 스펙을 밖에서 덮는 통로라 Figma 완전싱크와 충돌한다.
 * `Input`·`Textarea`·`Checkbox`도 같은 방식으로 막았다.
 */
interface IChipProps extends Omit<ComponentPropsWithoutRef<'div'>, 'className'> {
  size?: ChipSizeType;
  active?: boolean;
  leftIcon?: IconComponentType;
  rightIcon?: IconComponentType | null;
  children: ReactNode;
  onRightIconClick?: () => void;
}

export const Chip = ({
  size = 'md',
  active = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  onRightIconClick,
  onClick,
  ...props
}: IChipProps) => {
  const activeVariant = active ? 'active' : 'default';

  return (
    <div
      className={ChipVariants({ size, active: activeVariant })}
      onClick={onClick}
      {...props}
    >
      {LeftIcon && (
        <LeftIcon
          /** Figma: sm은 16px(sm), md는 20px(md). 칩 크기를 따라간다. */
          size={size === 'sm' ? 'sm' : 'md'}
          color={active ? 'status-main-standby' : 'label-alternative'}
        />
      )}
      {children}
      {RightIcon && (
        <RightIcon
          size="xs"
          color={active ? 'status-main-standby' : 'label-alternative'}
          cursor={onRightIconClick ? 'pointer' : 'default'}
          onClick={(e) => {
            /** Chip 전체의 onClick까지 클릭이 새지 않게 막는다. */
            e.stopPropagation();
            onRightIconClick?.();
          }}
        />
      )}
    </div>
  );
};

const ChipVariants = cva('flex items-center border w-fit cursor-pointer', {
  variants: {
    active: {
      default:
        'bg-background-normal border-line-strong text-label-alternative interaction',
      active: '',
    },
    size: {
      md: 'py-1 px-2.5 rounded-xl typo-body-2 h-[32px] gap-2',
      sm: 'py-1 px-3 rounded-xl typo-caption-1 h-[26px] gap-1',
    },
  },
  compoundVariants: [
    {
      active: 'active',
      size: ['sm', 'md'],
      className:
        'bg-interaction-active border-status-main-standby text-status-main-standby',
    },
    {
      active: 'default',
      size: ['sm', 'md'],
      className: 'after:rounded-xl',
    },
  ],
});
