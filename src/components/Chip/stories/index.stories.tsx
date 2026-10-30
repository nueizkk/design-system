import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Chip } from '..';
import * as Icon from '../../../icons';

const meta: Meta<typeof Chip> = {
  title: 'components/Chip',
  component: Chip,
  args: {
    size: 'md',
    active: false,
    leftIcon: undefined,
    rightIcon: undefined,
    children: 'text',
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md'],
    },
    active: {
      control: 'boolean',
    },
    /**
     * 슬롯이 컴포넌트를 받으므로 select에 값을 직접 못 넣는다 —
     * 라벨만 options에 두고 mapping으로 실제 컴포넌트를 연결한다.
     */
    leftIcon: {
      control: 'select',
      options: ['none', 'circleCheck', 'calendar', 'search'],
      mapping: {
        none: undefined,
        circleCheck: Icon.CircleCheck,
        calendar: Icon.Calendar,
        search: Icon.Search,
      },
    },
    rightIcon: {
      control: 'select',
      options: ['none', 'xMark', 'circleCheck'],
      mapping: {
        none: undefined,
        xMark: Icon.XMark,
        circleCheck: Icon.CircleCheck,
      },
    },
    children: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Chip>;

export const Playground: Story = {
  render: (args) => {
    const [active, setActive] = useState(args.active);

    return (
      <Chip {...args} active={active} onClick={() => setActive((v) => !v)} />
    );
  },
};
