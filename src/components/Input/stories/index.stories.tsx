import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '..';
import * as Icon from '../../../icons';

const meta: Meta<typeof Input> = {
  title: 'components/Input',
  component: Input,
};

export default meta;

type Story = StoryObj<typeof Input>;

const caption: React.CSSProperties = {
  marginBottom: 8,
  fontSize: 12,
  color: '#888',
};

const stack: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  width: 320,
};

export const Sizes: Story = {
  render: () => (
    <div style={stack}>
      <Input size="sm" label="sm" placeholder="placeholder" />
      <Input size="md" label="md" placeholder="placeholder" />
      <Input size="lg" label="lg" placeholder="placeholder" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={stack}>
      <Input size="md" label="default" placeholder="placeholder" />
      <Input
        size="md"
        label="filled"
        defaultValue="filled value"
        readOnly={false}
      />
      <Input
        size="md"
        label="error"
        error
        defaultValue="information"
        errorMessage="feedback text"
      />
      <Input size="md" label="readOnly" defaultValue="information" readOnly />
      <Input size="md" label="disabled" placeholder="placeholder" disabled />
    </div>
  ),
};

export const LeftAndRightIcon: Story = {
  render: () => (
    <div style={stack}>
      <Input size="md" label="leftIcon" leftIcon={Icon.Search} placeholder="검색" />
      <Input
        size="md"
        label="rightIcon"
        rightIcon={Icon.Calendar}
        onRightIconClick={() => alert('rightIcon clicked')}
        placeholder="날짜 선택"
      />
    </div>
  ),
};

export const Unit: Story = {
  render: () => (
    <div style={stack}>
      <Input size="md" label="수량" defaultValue="1.2" unit="ETH" />
    </div>
  ),
};

export const Password: Story = {
  render: () => (
    <div style={stack}>
      <Input
        size="md"
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
      />
    </div>
  ),
};

export const ClearButton: Story = {
  render: () => (
    <div style={stack}>
      <p style={caption}>
        포커스된 상태에서 값을 입력하면(type 상태) 우측에 clear(X) 아이콘이
        나타납니다. 클릭하면 값이 비워집니다.
      </p>
      <Input size="md" label="label text" placeholder="입력해보세요" />
    </div>
  ),
};

