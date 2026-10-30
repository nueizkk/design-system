import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import Textarea from '..';

const meta: Meta<typeof Textarea> = {
  title: 'components/Textarea',
  component: Textarea,
};

export default meta;

type Story = StoryObj<typeof Textarea>;

/** Figma(34422:20437)의 interaction 7종. active·type은 포커스/입력으로 파생된다. */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 528 }}>
      <Textarea label="label text" placeholder="Placeholder" maxLength={300} />
      <Textarea
        label="label text"
        placeholder="Placeholder"
        defaultValue="information"
        maxLength={300}
      />
      <Textarea
        label="label text"
        placeholder="Placeholder"
        defaultValue="information"
        error
        errorMessage="feedback text"
        maxLength={300}
      />
      <Textarea
        label="label text"
        placeholder="Placeholder"
        defaultValue="information"
        disabled
        maxLength={300}
      />
      <Textarea
        label="label text"
        placeholder="Placeholder"
        defaultValue="information"
        readOnly
        maxLength={300}
      />
    </div>
  ),
};

/** 라벨 없이, 카운터 없이 쓰는 최소 형태 */
export const Minimal: Story = {
  render: () => <Textarea placeholder="Placeholder" />,
};

/** 고정 높이(160px)를 넘기면 내부에서 세로 스크롤이 생긴다. */
export const Overflow: Story = {
  render: () => (
    <Textarea
      label="내용이 넘칠 때"
      placeholder="Placeholder"
      defaultValue={Array.from({ length: 20 }, (_, i) => `${i + 1}번째 줄`).join('\n')}
      maxLength={300}
    />
  ),
};

const ControlledDemo = () => {
  const [value, setValue] = useState('');
  return (
    <Textarea
      label="controlled"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="입력하면 카운터가 실시간으로 갱신된다"
      maxLength={50}
    />
  );
};

/** controlled에서도 카운터가 value를 따라간다. */
export const Controlled: Story = { render: () => <ControlledDemo /> };
