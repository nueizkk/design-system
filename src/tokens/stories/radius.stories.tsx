import type { Meta, StoryObj } from '@storybook/react-vite';

import { radius } from '../radius';

import { TokenTable } from './TokenTable';

const meta: Meta = { title: 'tokens/radius' };
export default meta;

type Story = StoryObj;

/** full(9999px)은 정사각형에서 원이 되므로 한 칸만 보고도 구분된다. */
export const Scale: Story = {
  render: () => (
    <TokenTable
      tokens={radius}
      preview={(value) => (
        <span
          className="bg-fill-strong border-line-strong block size-16 border"
          style={{ borderRadius: value }}
        />
      )}
    />
  ),
};
