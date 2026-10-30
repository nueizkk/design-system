import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { TitleCell } from '../Cell/TitleCell';
import { CellAlignType, SortDirectionType } from '../types';

const meta: Meta<typeof TitleCell> = {
  title: 'components/Table/TitleCell',
  component: TitleCell,
};

export default meta;

type Story = StoryObj<typeof TitleCell>;

/**
 * 컬럼 제목 한 칸. **패딩이 없다** — 칸의 여백은 행이 정한다.
 *
 * `sort`를 넘기면 눌러서 정렬 방향이 `asc → desc → 없음`으로 돈다. 정렬 중인
 * 컬럼만 아이콘이 파랗다.
 */
const Playground = () => {
  const [align, setAlign] = useState<CellAlignType>('left');
  const [sortable, setSortable] = useState(true);
  const [direction, setDirection] = useState<SortDirectionType | undefined>();

  const toggle = () =>
    setDirection((prev) =>
      prev === 'asc' ? 'desc' : prev === 'desc' ? undefined : 'asc',
    );

  return (
    <div className="flex flex-col gap-8 p-10">
      <div className="typo-caption-1 text-label-neutral flex items-center gap-6">
        <span className="flex items-center gap-1">
          align
          {(['left', 'center', 'right'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAlign(value)}
              className={
                value === align
                  ? 'bg-primary-normal text-static-white rounded-sm px-2 py-1'
                  : 'bg-fill-normal rounded-sm px-2 py-1'
              }
            >
              {value}
            </button>
          ))}
        </span>
        <button
          type="button"
          onClick={() => setSortable((prev) => !prev)}
          className={
            sortable
              ? 'bg-primary-normal text-static-white rounded-sm px-2 py-1'
              : 'bg-fill-normal rounded-sm px-2 py-1'
          }
        >
          sort
        </button>
        <span>방향: {direction ?? '없음'}</span>
      </div>

      {/** 실제 칸처럼 폭을 제한해 둔다 — 넘치면 말줄임된다. */}
      <div className="border-line-normal w-[200px] border border-dashed p-2">
        <TitleCell
          align={align}
          sort={sortable ? { direction, onToggle: toggle } : undefined}
        >
          거래 일시
        </TitleCell>
      </div>

      <div className="border-line-normal w-[200px] border border-dashed p-2">
        <TitleCell
          align={align}
          sort={sortable ? { direction, onToggle: toggle } : undefined}
        >
          아주 긴 컬럼 제목이 들어오면 말줄임된다
        </TitleCell>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <Playground />,
};
