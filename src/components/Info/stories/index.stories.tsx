import type { Meta, StoryObj } from '@storybook/react-vite';

import { Info } from '..';
import { Status } from '../../Status';

const meta: Meta<typeof Info> = {
  title: 'components/Info',
  component: Info,
};

export default meta;

type Story = StoryObj<typeof Info>;

export const Default: Story = {
  render: () => (
    <Info
      items={[
        { label: '유형', value: '계정 정보' },
        { label: '이메일', value: 'ds@0529th.com' },
        {
          label: '지갑 주소',
          value: '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97',
          copy: true,
          onCopy: (text) => console.log('복사', text),
        },
        { label: '상태', value: <Status type="positive" label="완료" /> },
        { label: '생성일', value: '2024-02-03 17:30:02' },
        /** 빈 값의 표현은 호출부가 정한다 — DS는 폴백을 두지 않는다. */
        { label: '비고', value: '-' },
      ]}
    />
  ),
};

/** 값이 라벨보다 길어 줄바꿈될 때 라벨이 위쪽에 붙는지 확인한다. */
export const LongValue: Story = {
  render: () => (
    /** 폭은 감싸는 쪽이 정한다 — `Info`는 `className`을 받지 않는다. */
    <div className="w-[320px]">
      <Info
        items={[
          {
            label: '지갑 주소',
            value: '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97',
          },
          { label: '유형', value: '계정 정보' },
        ]}
      />
    </div>
  ),
};

/**
 * `copy`를 켜면 값 오른쪽에 복사 아이콘이 붙는다. **무엇을 복사할지는 넘기지
 * 않는다** — 렌더된 글자를 그대로 읽으므로 `value`에 어떤 노드를 넣어도 보이는
 * 대로 복사된다.
 */
export const WithCopy: Story = {
  render: () => (
    <Info
      items={[
        {
          label: '지갑 주소',
          value: '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97',
          copy: true,
          onCopy: (text) => console.log('복사', text),
        },
        {
          label: '가공된 값',
          value: (
            <>
              1,234.5678 <b>ETH</b>
            </>
          ),
          copy: true,
          onCopy: (text) => console.log('복사', text),
        },
        { label: '복사 없음', value: '계정 정보' },
      ]}
    />
  ),
};
