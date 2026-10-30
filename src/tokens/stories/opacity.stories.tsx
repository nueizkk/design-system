import type { Meta, StoryObj } from '@storybook/react-vite';

import { gradient } from '../gradient';
import { opacity } from '../opacity';

import { Checker } from './Checker';
import { TokenTable } from './TokenTable';

const meta: Meta = { title: 'tokens/opacity' };
export default meta;

type Story = StoryObj;

export const Scale: Story = {
  render: () => (
    <TokenTable
      tokens={opacity}
      preview={(value) => (
        <Checker className="h-8 w-40">
          <span
            className="bg-primary-normal block size-full rounded"
            style={{ opacity: value }}
          />
        </Checker>
      )}
    />
  ),
};

/**
 * Gradient는 색이 아니라 mask-image로 만든 불투명도 띠다. 클래스명의 방향이
 * **불투명한 쪽**이고 반대편으로 사라진다 — 이름만 보면 거꾸로 읽기 쉽다.
 * 클래스는 `tailwindConfig`의 safelist에 있어 동적 조합도 안전하다.
 */
export const Gradient: Story = {
  render: () => (
    <TokenTable
      tokens={gradient}
      format={(to) => `linear-gradient(${to}, …)`}
      preview={(_, name) => (
        <span className={`bg-primary-normal block h-20 w-60 gradient-${name}`} />
      )}
    />
  ),
};
