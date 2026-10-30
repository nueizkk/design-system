import type { Meta, StoryObj } from '@storybook/react-vite';

import { typography } from '../typography';
import { weight } from '../weight';

import { TokenTable } from './TokenTable';

const meta: Meta = { title: 'tokens/typography' };
export default meta;

type Story = StoryObj;

const SAMPLE = '다람쥐 헌 쳇바퀴에 Whale 0123';

/**
 * 고정 스케일 10종. `typo-responsive-*`(corp 전용 축소값)는 뷰포트를 줄여야
 * 차이가 보여서 표로는 의미가 없다 — 필요하면 별도 스토리로 뺀다.
 */
export const Scale: Story = {
  render: () => (
    <TokenTable
      tokens={typography}
      /** letterSpacing은 36px 이상에만 있어서 키를 못 박고 값만 순서대로 읽는다. */
      format={(value) => Object.values(value).join(' / ')}
      preview={(value) => (
        <span className="block" style={value}>
          {SAMPLE}
        </span>
      )}
    />
  ),
};

/** theme.fontWeight를 통째로 교체하므로 이 4종 밖의 굵기는 존재하지 않는다. */
export const Weight: Story = {
  render: () => (
    <TokenTable
      tokens={weight}
      preview={(value) => (
        <span className="typo-subtitle-1 block" style={{ fontWeight: value }}>
          {SAMPLE}
        </span>
      )}
    />
  ),
};
