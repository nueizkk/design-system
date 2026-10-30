import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { FileInput } from '..';

const meta: Meta<typeof FileInput> = {
  title: 'components/FileInput',
  component: FileInput,
};

export default meta;

type Story = StoryObj<typeof FileInput>;

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  width: 320,
};

const SizeDemo = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <FileInput
      size={size}
      label={size}
      value={value}
      onFileSelect={(file) => setValue(file.name)}
      onClear={() => setValue(null)}
    />
  );
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
    <FileInput
      size="md"
      label="default"
      value={value}
      onFileSelect={(file) => setValue(file.name)}
      onClear={() => setValue(null)}
    />
  );
};

const FilledDemo = () => {
  const [value, setValue] = useState<string | null>('regulation_v2.pdf');
  return (
    <FileInput
      size="md"
      label="filled"
      value={value}
      onFileSelect={(file) => setValue(file.name)}
      onClear={() => setValue(null)}
    />
  );
};

const ErrorDemo = () => {
  const [value, setValue] = useState<string | null>('regulation_v2.pdf');
  return (
    <FileInput
      size="md"
      label="error"
      value={value}
      onFileSelect={(file) => setValue(file.name)}
      onClear={() => setValue(null)}
      error
      errorMessage="feedback text"
    />
  );
};

const DisabledDemo = () => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <FileInput
      size="md"
      label="disabled"
      value={value}
      onFileSelect={(file) => setValue(file.name)}
      onClear={() => setValue(null)}
      disabled
    />
  );
};

const ReadOnlyDemo = () => {
  const [value, setValue] = useState<string | null>('regulation_v2.pdf');
  return (
    <FileInput
      size="md"
      label="readOnly"
      value={value}
      onFileSelect={(file) => setValue(file.name)}
      onClear={() => setValue(null)}
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
