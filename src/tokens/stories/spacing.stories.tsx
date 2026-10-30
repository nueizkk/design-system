import type { Meta, StoryObj } from '@storybook/react-vite';

import { spacing } from '../spacing';

import { TokenTable } from './TokenTable';

const meta: Meta = { title: 'tokens/spacing' };
export default meta;

type Story = StoryObj;

/** 막대 길이가 곧 값이다 — 0px과 px(1px)도 눈에 띄도록 최소 높이를 준다. */
export const Scale: Story = {
  render: () => (
    <TokenTable
      tokens={spacing}
      preview={(value) => (
        <span
          className="bg-primary-normal block h-2 rounded-sm"
          style={{ width: value }}
        />
      )}
    />
  ),
};
