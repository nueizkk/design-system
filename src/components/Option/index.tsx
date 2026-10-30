import { HTMLAttributes, MouseEvent } from 'react';

import { cva } from 'class-variance-authority';
import { TokenSemanticColorType, TokenTypographyType } from 'tokens';

import { IconComponentType, IconSizeType } from '../../icons';
import { Text } from '../Text';
import { cn } from '../utils/cn';

export type OptionSizeType = 'xs' | 'sm' | 'md' | 'lg';

interface IOptionCommonProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  // 화면에 보이는 label과 별개로, 어떤 옵션이 선택됐는지 식별하는 값. Option을 쓰는
  // 곳(Selectbox/Accordion 등)은 전부 "여러 개 중 하나를 고르는" 목록이라 항상 필요하다.
  value: string;
  active?: boolean;
  disabled?: boolean;
  leftIcon?: IconComponentType;
  /**
   * 왼쪽에 아이콘 한 칸만큼 빈 자리를 둔다. 아이콘이 없는 옵션을 아이콘 있는
   * 형제와 같은 선에서 시작시킬 때 쓴다 — 폭은 `leftIcon`과 같다.
   */
  indent?: boolean;
  rightIcon?: IconComponentType;
  onRightIconClick?: () => void;
  label: string;
  /**
   * 기본 텍스트·아이콘 색. Figma Sidebar 문서 기준 Client는 `label-normal`,
   * Admin은 다크 배경이라 `static-white`를 쓴다.
   *
   * active·disabled·negative의 의미색이 항상 우선이므로, 이 값은 "아무 상태도
   * 아닐 때"의 색만 정한다.
   */
  color?: Extract<TokenSemanticColorType, 'label-normal' | 'static-white'>;
}

// negative는 Figma 기준 xs 사이즈에서만 정의된 속성이라 다른 사이즈와 함께 못 넣게 막는다.
export type IOptionProps =
  | (IOptionCommonProps & {
      size: Extract<OptionSizeType, 'xs'>;
      negative?: boolean;
    })
  | (IOptionCommonProps & {
      size: Exclude<OptionSizeType, 'xs'>;
      negative?: never;
    });

export const Option = ({
  size,
  value,
  active = false,
  disabled = false,
  negative = false,
  leftIcon: LeftIcon,
  indent = false,
  rightIcon: RightIcon,
  onRightIconClick,
  label,
  color = 'label-normal',
  onClick,
  ...props
}: IOptionProps) => {
  // disabled가 최우선, active는 배경+bold, negative는 색상만 담당하는 독립 축이라 동시에 켤 수 있다.
  const textColor: TokenSemanticColorType =
    (disabled && 'label-disable') ||
    (negative && 'status-main-negative') ||
    (active && 'primary-normal') ||
    color;

  const typo = TYPO[size];
  const iconSize = ICON_SIZE[size];

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(e);
  };

  return (
    <div
      className={optionVariants({ size, active, disabled })}
      onClick={handleClick}
      data-value={value}
      data-disabled={disabled.toString()}
      {...props}
    >
      {active && (
        <span className="absolute inset-0 rounded-sm bg-interaction-active" />
      )}
      {indent && (
        <span className={cn('relative shrink-0', INDENT[iconSize])} />
      )}
      {LeftIcon && (
        <LeftIcon
          size={iconSize}
          color={textColor}
          className="relative shrink-0"
        />
      )}
      <Text
        variant={typo}
        weight={active ? 'bold' : 'regular'}
        color={textColor}
        className="relative min-w-[60px] flex-1 truncate text-left"
      >
        {label}
      </Text>
      {RightIcon && (
        <RightIcon
          size={iconSize}
          color={textColor}
          cursor={!disabled && onRightIconClick ? 'pointer' : 'default'}
          onClick={(e) => {
            if (disabled) return;
            /** Option 전체의 onClick까지 클릭이 새지 않게 막는다. */
            e.stopPropagation();
            onRightIconClick?.();
          }}
          className="relative shrink-0"
          data-testid="optionRightIcon"
        />
      )}
    </div>
  );
};

/** 사이즈가 늘면 어떤 타이포를 쓸지 여기서 정해야 컴파일이 통과한다. */
const TYPO = {
  xs: 'body-2',
  sm: 'body-2',
  md: 'body-1',
  lg: 'body-1',
} satisfies Record<OptionSizeType, TokenTypographyType>;

/** 아이콘 크기도 같다 — 누락되면 잡힌다. */
const ICON_SIZE = {
  xs: 'md',
  sm: 'md',
  md: 'md',
  lg: 'lg',
} satisfies Record<OptionSizeType, IconSizeType>;

/**
 * Tailwind는 리터럴 클래스만 감지하므로 `w-[${...}]`로 조합할 수 없다.
 * 값은 `icons/base.tsx`의 `iconSize`와 같다(md 20px · lg 24px).
 *
 * 키는 `ICON_SIZE`가 실제로 내놓는 값에서 끌어온다 — 거기에 크기를 더하면
 * 여기에 폭을 적을 때까지 컴파일이 막힌다.
 */
const INDENT: Record<(typeof ICON_SIZE)[OptionSizeType], string> = {
  md: 'w-[20px]',
  lg: 'w-[24px]',
};

const optionVariants = cva('relative flex w-full items-center text-left', {
  variants: {
    /** 사이즈가 늘면 OptionSizeType만 고치면 여기서 누락이 잡힌다. */
    size: {
      xs: 'h-8 gap-2 px-3 py-1.5',
      sm: 'h-10 gap-4 px-3 py-2.5',
      md: 'h-12 gap-4 px-3 py-3',
      lg: 'h-14 gap-4 px-3 py-4',
    } satisfies Record<OptionSizeType, string>,
    disabled: {
      true: 'cursor-not-allowed',
      false: 'cursor-pointer',
    },
    active: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    // hover 오버레이는 안쪽 span 대신 바깥 컨테이너에 붙여야 leftIcon·텍스트 위에서도 :hover가 버블링된다.
    {
      disabled: false,
      active: false,
      className: 'interaction after:rounded-sm',
    },
  ],
});
