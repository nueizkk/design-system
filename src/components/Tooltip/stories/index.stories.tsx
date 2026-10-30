import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tooltip, type TooltipTrigger } from '..';
import { SideType } from '../../Popover/Portal';

const meta: Meta<typeof Tooltip> = {
  title: 'components/Tooltip',
  component: Tooltip,
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

const LABEL = '미신고 가상자산사업자와의 입출금 제한 및 유의사항 안내';

/** 스토리 전용 조작 줄. DS 부품이 아니라 플레이그라운드를 위한 것이다. */
const Switch = <T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
}) => (
  <label className="typo-caption-1 text-label-neutral flex items-center gap-2">
    {label}
    <span className="flex gap-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={
            option === value
              ? 'bg-primary-normal text-static-white rounded-sm px-2 py-1'
              : 'bg-fill-normal text-label-neutral rounded-sm px-2 py-1'
          }
        >
          {option}
        </button>
      ))}
    </span>
  </label>
);

/**
 * 띄우는 방법(hover·click)과 위치(top·bottom)를 바꿔가며 본다.
 *
 * "잘리는 상자"를 켜면 `overflow-hidden`인 좁은 칸 안에 트리거가 들어간다 — 표
 * 셀이 그 상황이다. 툴팁은 body로 포탈되므로 **상자 밖으로 나가서** 그려진다.
 * 전에는 `absolute`라 이 상자에 잘려 보이지 않았다.
 */
const Playground = () => {
  const [side, setSide] = useState<SideType>('top');
  const [trigger, setTrigger] = useState<TooltipTrigger>('hover');
  const [clipped, setClipped] = useState(true);

  const tooltip = (
    <Tooltip label={LABEL} side={side} trigger={trigger}>
      <Tooltip.Trigger>
        <p className="typo-body-2 text-label-normal w-[144px] overflow-hidden text-ellipsis whitespace-nowrap">
          {LABEL}
        </p>
      </Tooltip.Trigger>
    </Tooltip>
  );

  return (
    <div className="flex flex-col gap-10 p-20">
      <div className="flex flex-wrap items-center gap-6">
        <Switch
          label="side"
          value={side}
          options={['top', 'bottom'] as const}
          onChange={setSide}
        />
        <Switch
          label="trigger"
          value={trigger}
          options={['hover', 'click'] as const}
          onChange={setTrigger}
        />
        <Switch
          label="잘리는 상자"
          value={clipped ? 'on' : 'off'}
          options={['on', 'off'] as const}
          onChange={(next) => setClipped(next === 'on')}
        />
      </div>

      {clipped ? (
        <div className="border-line-normal w-[160px] overflow-hidden border p-2">
          {tooltip}
        </div>
      ) : (
        tooltip
      )}
    </div>
  );
};

export const Default: Story = {
  render: () => <Playground />,
};
