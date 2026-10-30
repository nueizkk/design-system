import { cva } from 'class-variance-authority';

export type StatusType =
  | 'positive'
  | 'ongoing'
  | 'off'
  | 'cautionary'
  | 'negative';

interface IStatusProps {
  type: StatusType;
  label: string;
}

export function Status({ type, label }: IStatusProps) {
  return (
    <div className={statusVariants({ status: type })}>
      {/* overlay 유틸이 `& > *`로 자식 "요소"만 오버레이 위로 올리므로 텍스트를 감싼다 */}
      <span>{label}</span>
    </div>
  );
}

const statusVariants = cva(
  'w-fit px-2 py-px rounded-md typo-caption-1 font-semibold whitespace-nowrap h-fit after:rounded-md',
  {
    variants: {
      status: {
        positive: 'text-status-sub-positive overlay-status-sub-positive/12',
        negative: 'text-status-main-negative overlay-status-sub-negative/8',
        ongoing: 'text-status-main-standby overlay-status-main-standby/8',
        cautionary:
          'text-status-main-cautionary overlay-status-sub-cautionary/28',
        off: 'text-label-neutral overlay-status-main-off',
      },
    },
    compoundVariants: [
      {
        status: ['positive', 'negative', 'ongoing', 'cautionary', 'off'],
        className: 'overlay bg-static-white',
      },
    ],
  },
);
