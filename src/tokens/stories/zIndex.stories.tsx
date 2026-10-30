import type { Meta, StoryObj } from '@storybook/react-vite';

import { zIndex } from '../zIndex';

const meta: Meta = { title: 'tokens/zIndex' };
export default meta;

type Story = StoryObj;

const COLORS: Record<string, string> = {
  sidebar: '#64748b',
  header: '#0ea5e9',
  loading: '#14b8a6',
  backdrop: '#6366f1',
  drawer: '#a855f7',
  modal: '#ec4899',
  popover: '#f97316',
  tooltip: '#eab308',
  toast: '#22c55e',
};

/**
 * 모든 레이어를 한 지점에 겹쳐 쌓는다. 토큰 순서가 맞다면 목록 아래쪽일수록
 * 위에 보여야 하고, 맨 위에 toast가 와야 한다.
 */
export const Ladder: Story = {
  render: () => (
    <div style={{ position: 'relative', height: 420, width: 620 }}>
      {Object.entries(zIndex).map(([name, value], i) => (
        <div
          key={name}
          style={{
            position: 'absolute',
            top: i * 34,
            left: i * 56,
            zIndex: Number(value),
            width: 300,
            padding: '10px 14px',
            background: COLORS[name],
            color: '#fff',
            borderRadius: 8,
            fontSize: 13,
            fontFamily: 'ui-monospace, monospace',
            boxShadow: '0 2px 10px rgba(0,0,0,.25)',
          }}
        >
          {name} · {value}
        </div>
      ))}
    </div>
  ),
};
