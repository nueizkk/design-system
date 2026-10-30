import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { DateInput } from '..';

const meta: Meta<typeof DateInput> = {
  title: 'components/DateInput',
  component: DateInput,
};

export default meta;

type Story = StoryObj<typeof DateInput>;

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  width: 320,
};

const SizeDemo = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
  const [value, setValue] = useState<string | null>(null);
  return <DateInput size={size} label={size} value={value} onChange={setValue} />;
};

export const Sizes: Story = {
  render: () => (
    <div style={stack}>
      <SizeDemo size="sm" />
      <SizeDemo size="md" />
      <SizeDemo size="lg" />
    </div>
  ),
};

const DefaultDemo = () => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <DateInput size="md" label="default" value={value} onChange={setValue} />
  );
};

const FilledDemo = () => {
  const [value, setValue] = useState<string | null>('2026-03-05');
  return (
    <DateInput size="md" label="filled" value={value} onChange={setValue} />
  );
};

const ErrorDemo = () => {
  const [value, setValue] = useState<string | null>('2026-03-05');
  return (
    <DateInput
      size="md"
      label="error"
      value={value}
      onChange={setValue}
      error
      errorMessage="feedback text"
    />
  );
};

const DisabledDemo = () => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <DateInput
      size="md"
      label="disabled"
      value={value}
      onChange={setValue}
      disabled
    />
  );
};

const ReadOnlyDemo = () => {
  const [value, setValue] = useState<string | null>('2026-03-05');
  return (
    <DateInput
      size="md"
      label="readOnly"
      value={value}
      onChange={setValue}
      readOnly
    />
  );
};

export const States: Story = {
  render: () => (
    <div style={stack}>
      <DefaultDemo />
      <FilledDemo />
      <ErrorDemo />
      <DisabledDemo />
      <ReadOnlyDemo />
    </div>
  ),
};
