import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Calendar } from '..';
import { SizeType } from '../config';

const meta: Meta<typeof Calendar> = {
  title: 'components/Calendar',
  component: Calendar,
  args: {
    size: 'sm',
    isRange: true,
    minDate: '',
    maxDate: '',
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'lg'],
    },
    isRange: {
      control: 'boolean',
    },
    minDate: {
      control: 'text',
      description: '이 날짜부터 선택 가능 (YYYY-MM-DD, 비우면 하한 없음)',
    },
    maxDate: {
      control: 'text',
      description: '이 날짜까지 선택 가능 (YYYY-MM-DD, 비우면 상한 없음)',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

interface ICalendarDemoProps {
  size: SizeType;
  isRange: boolean;
  minDate?: string;
  maxDate?: string;
}

function CalendarDemo({ size, isRange, minDate, maxDate }: ICalendarDemoProps) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  return isRange ? (
    <Calendar
      size={size}
      isRange
      startDate={startDate}
      endDate={endDate}
      setStartDate={setStartDate}
      setEndDate={setEndDate}
      minDate={minDate || undefined}
      maxDate={maxDate || undefined}
    />
  ) : (
    <Calendar
      size={size}
      isRange={false}
      startDate={startDate}
      setStartDate={setStartDate}
      minDate={minDate || undefined}
      maxDate={maxDate || undefined}
    />
  );
}

export const Playground: Story = {
  args: {
    size: "lg",
    isRange: false,
    minDate: "2025-09-11"
  },

  render: (args) => (
    <CalendarDemo
      size={args.size ?? 'sm'}
      isRange={args.isRange ?? true}
      minDate={args.minDate}
      maxDate={args.maxDate}
    />
  )
};
