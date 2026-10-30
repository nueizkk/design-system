import type { Meta, StoryObj } from '@storybook/react-vite';

import { shadow } from '../shadow';

import { TokenTable } from './TokenTable';

const meta: Meta = { title: 'tokens/shadow' };
export default meta;

type Story = StoryObj;

/**
 * 그림자는 겹친 레이어 합이라 값 문자열만 봐서는 세기를 못 가늠한다.
 * 카드를 같은 배경 위에 올려 100~400의 단계 차이를 눈으로 비교한다.
 */
export const Scale: Story = {
  render: () => (
    <div className="bg-background-normal p-6">
      <TokenTable
        tokens={shadow}
        format={(value) => value.replace(/, /g, ',\n')}
        preview={(value) => (
          <span
            className="bg-background-elevated my-2 block size-20 rounded-md"
            style={{ boxShadow: value }}
          />
        )}
      />
    </div>
  ),
};
