import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from '..';
import { TokenRadiusType } from '../../../tokens';
import { cn } from '../../utils/cn';

const meta: Meta<typeof Skeleton> = {
  title: 'components/Skeleton',
  component: Skeleton,
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

const RADII: TokenRadiusType[] = ['xs', 'sm', 'md', 'xl', 'full'];

/**
 * 데이터를 기다리는 자리를 채우는 **회색 네모 하나**다. 모양이 전부라 그 자체로는
 * 쓸 일이 드물고, 화면별 로딩 뼈대를 조립하는 재료로 쓴다.
 *
 * **크기를 부모가 정하지 않는다** — `width`·`height`를 직접 받는다. 기본값이
 * `100%`라 칸에 그냥 넣으면 칸을 채운다.
 *
 * 표 로딩은 이걸 직접 쓸 일이 없다. `<Table isLoading />`이 컬럼 폭에 맞춰
 * 알아서 그린다.
 */
const Playground = () => {
  const [rounded, setRounded] = useState<TokenRadiusType>('sm');
  const [play, setPlay] = useState(true);

  return (
    <div className="flex flex-col gap-8 p-10">
      <div className="typo-caption-1 text-label-neutral flex items-center gap-2">
        <span className="flex items-center gap-1">
          rounded
          {RADII.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRounded(value)}
              className={cn(
                'rounded-sm px-2 py-1',
                value === rounded
                  ? 'bg-primary-normal text-static-white'
                  : 'bg-fill-normal',
              )}
            >
              {value}
            </button>
          ))}
        </span>
        <button
          type="button"
          onClick={() => setPlay((v) => !v)}
          className={cn(
            'rounded-sm px-2 py-1',
            play ? 'bg-primary-normal text-static-white' : 'bg-fill-normal',
          )}
        >
          play
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton rounded={rounded} play={play} width="320px" height="20px" />
        <Skeleton rounded={rounded} play={play} width="200px" height="20px" />
        <div className="flex items-center gap-3">
          <Skeleton rounded={rounded} play={play} width="40px" height="40px" />
          <Skeleton rounded={rounded} play={play} width="120px" height="20px" />
        </div>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <Playground />,
};

/**
 * 실제 쓰임새 — 상세 화면의 로딩 뼈대를 조립한 모습이다. 소비앱이 이런 식으로
 * 화면마다 자기 뼈대를 만든다.
 */
export const Composed: Story = {
  render: () => (
    <div className="border-line-normal flex w-[480px] flex-col gap-6 rounded-sm border p-6">
      <Skeleton width="180px" height="28px" rounded="sm" />
      <div className="flex items-center gap-3">
        <Skeleton width="40px" height="40px" rounded="full" />
        <div className="flex flex-col gap-2">
          <Skeleton width="120px" height="16px" rounded="xs" />
          <Skeleton width="80px" height="16px" rounded="xs" />
        </div>
      </div>
      <Skeleton height="160px" rounded="sm" />
    </div>
  ),
};
