import type { Meta, StoryObj } from '@storybook/react-vite';

import { SelectChips } from '..';

const meta: Meta<typeof SelectChips> = {
  title: 'components/SelectChips',
  component: SelectChips,
};

export default meta;

type Story = StoryObj<typeof SelectChips>;

const items = [
  { label: 'text', value: 'a' },
  { label: 'text', value: 'b' },
  { label: 'text', value: 'c' },
  { label: 'text', value: 'd' },
];

export const Single: Story = {
  render: () => (
    <SelectChips type="single" items={items} defaultValue="b" />
  ),
};

export const Multiple: Story = {
  render: () => (
    <SelectChips type="multiple" items={items} defaultValue={['b', 'c']} />
  ),
};
