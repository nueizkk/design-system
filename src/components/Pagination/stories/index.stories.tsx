import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pagination } from '..';
import { cn } from '../../utils/cn';

const meta: Meta<typeof Pagination> = {
  title: 'components/Pagination',
  component: Pagination,
};

export default meta;

type Story = StoryObj<typeof Pagination>;

/**
 * 숫자는 **10개 묶음**으로만 보여준다(Figma 문서). 지금 페이지가 속한 묶음만
 * 그리고, 마지막 묶음은 남은 개수만 선다(총 13페이지 → `11 12 13`).
 *
 * - `‹` `›` — 1페이지 이전·다음
 * - `«` `»` — **이전·다음 묶음의 첫 페이지**로. 11~13에서 `«`를 누르면 1이다
 * - 갈 곳이 없으면 화살표가 흐려지고 커서가 `not-allowed`가 된다
 *
 * 총 건수를 바꿔가며 묶음 경계를 보면 된다. 13페이지면 두 묶음이고, 두 번째
 * 묶음에는 `11 12 13` 셋만 선다. **0건이면 아예 그리지 않는다.**
 */
const Playground = () => {
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(130);
  const perPage = 10;

  const Toggle = ({ value }: { value: number }) => (
    <button
      type="button"
      onClick={() => {
        setTotal(value);
        setPage(1);
      }}
      className={cn(
        'rounded-sm px-2 py-1',
        total === value
          ? 'bg-primary-normal text-static-white'
          : 'bg-fill-normal',
      )}
    >
      {value === 0 ? '0건' : `${value / perPage}페이지`}
    </button>
  );

  return (
    <div className="flex flex-col gap-6 p-10">
      <div className="typo-caption-1 text-label-neutral flex items-center gap-2">
        <Toggle value={0} />
        <Toggle value={30} />
        <Toggle value={100} />
        <Toggle value={130} />
        <Toggle value={500} />
        <span className="ml-2">현재 {page}페이지</span>
      </div>

      <Pagination
        page={page}
        totalItems={total}
        pageSize={perPage}
        onPageChange={setPage}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <Playground />,
};
