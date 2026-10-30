import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Dim } from '..';
import { Button } from '../../Button';

const meta: Meta<typeof Dim> = {
  title: 'components/Dim',
  component: Dim,
};

export default meta;

type Story = StoryObj<typeof Dim>;

/**
 * 화면 전체를 덮는 어두운 막(`Material/Dim`, 불투명도 28%). `Modal`과 `Drawer`가
 * **같은 막을 쓴다** — `Drawer`는 안에서 이미 깔고 있어 따로 쓸 일이 없다.
 *
 * 눈여겨볼 것:
 * - **body로 포탈된다.** 아래 상자는 `transform`이 있어 스태킹 컨텍스트인데도
 *   딤이 화면 전체를 덮는다. 포탈이 없으면 저 상자 안에만 깔린다
 * - 떠 있는 동안 **배경 스크롤이 잠긴다**
 * - 딤을 누르면 `onClick`이 불린다
 *
 * **두 장을 겹치지 않는다.** 28%가 두 겹이면 48%가 되어 배경이 두 배로
 * 어두워진다. 모달이 여러 개 떠도 딤은 한 장만 두고 z-index로 순서를 만든다.
 */
const Playground = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-10">
      {/** 일부러 스태킹 컨텍스트를 만든다 — transform이 있으면 z-index가 갇힌다. */}
      <div className="border-line-normal w-[320px] translate-x-0 border border-dashed p-6">
        <p className="typo-caption-1 text-label-neutral mb-4">
          이 상자는 `transform`이 있어 스태킹 컨텍스트다. 딤은 그래도 화면 전체를
          덮는다.
        </p>
        <Button size="md" onClick={() => setOpen(true)}>
          딤 띄우기
        </Button>
      </div>

      <p className="typo-body-2 text-label-normal">
        본문. 딤이 떠 있는 동안에는 이 페이지가 스크롤되지 않는다. 딤을 누르면
        닫힌다.
      </p>
      <div className="h-[1200px]" />

      {open && <Dim onClick={() => setOpen(false)} />}
    </div>
  );
};

export const Default: Story = {
  render: () => <Playground />,
};
