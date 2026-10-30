import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '..';
import { ButtonVariantType } from '../config';
import * as Icon from '../../../icons';

const VARIANTS: ButtonVariantType[] = ['primary', 'outline', 'secondary'];

const meta: Meta<typeof Button> = {
  title: 'components/Button',
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button size="md" variant="primary">
        Primary
      </Button>
      <Button size="md" variant="outline">
        Outline
      </Button>
      <Button size="md" variant="secondary">
        Secondary
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

function IconsDemoRow({ variant }: { variant: ButtonVariantType }) {
  const [refreshing, setRefreshing] = useState(false);
  const [proceeding, setProceeding] = useState(false);

  const simulate = (setter: (v: boolean) => void) => {
    setter(true);
    setTimeout(() => setter(false), 1500);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 80, fontSize: 12, color: '#888' }}>{variant}</span>
      <Button
        size="md"
        variant={variant}
        leftIcon={Icon.ArrowRefresh}
        isLoading={refreshing}
        onClick={() => simulate(setRefreshing)}
      >
        새로고침
      </Button>
      <Button
        size="md"
        variant={variant}
        rightIcon={Icon.ArrowRight}
        isLoading={proceeding}
        onClick={() => simulate(setProceeding)}
      >
        다음
      </Button>
    </div>
  );
}

export const Icons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {VARIANTS.map((variant) => (
        <IconsDemoRow key={variant} variant={variant} />
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Button size="md" disabled>
        Disabled
      </Button>
      <div style={{ width: 300 }}>
        <Button size="md" fullWidth>
          Full Width
        </Button>
      </div>
    </div>
  ),
};
