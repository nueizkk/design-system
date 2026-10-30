import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { DataCell } from '../Cell/DataCell';
import { CellAlignType } from '../types';

const meta: Meta<typeof DataCell> = {
  title: 'components/Table/DataCell',
  component: DataCell,
};

export default meta;

type Story = StoryObj<typeof DataCell>;

const Toggle = ({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'rounded-sm px-2 py-1',
      on ? 'bg-primary-normal text-static-white' : 'bg-fill-normal',
    )}
  >
    {label}
  </button>
);

const cn = (...parts: (string | false | undefined)[]) =>
  parts.filter(Boolean).join(' ');

/**
 * 데이터 한 칸. `[분류] 값 [복사] [단위]`가 4px 간격으로 선다.
 *
 * **말줄임은 값에만 걸린다** — 긴 값을 켜도 분류·복사·단위는 줄지 않는다.
 * 잘리면 hover 시 툴팁이 뜨고, `tooltip="always"`면 안 잘려도 뜬다.
 */
const Playground = () => {
  const [align, setAlign] = useState<CellAlignType>('left');
  const [category, setCategory] = useState(true);
  const [copy, setCopy] = useState(true);
  const [currency, setCurrency] = useState(true);
  const [longValue, setLongValue] = useState(false);
  const [always, setAlways] = useState(false);
  const [copied, setCopied] = useState<string>();

  return (
    <div className="flex flex-col gap-8 p-10">
      <div className="typo-caption-1 text-label-neutral flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1">
          align
          {(['left', 'center', 'right'] as const).map((value) => (
            <Toggle
              key={value}
              label={value}
              on={value === align}
              onClick={() => setAlign(value)}
            />
          ))}
        </span>
        <Toggle
          label="category"
          on={category}
          onClick={() => setCategory((v) => !v)}
        />
        <Toggle label="copy" on={copy} onClick={() => setCopy((v) => !v)} />
        <Toggle
          label="currency"
          on={currency}
          onClick={() => setCurrency((v) => !v)}
        />
        <Toggle
          label="긴 값"
          on={longValue}
          onClick={() => setLongValue((v) => !v)}
        />
        <Toggle
          label="tooltip=always"
          on={always}
          onClick={() => setAlways((v) => !v)}
        />
      </div>

      {/** 실제 칸처럼 폭을 제한해 둔다. */}
      <div className="border-line-normal w-[240px] border border-dashed p-2">
        <DataCell
          align={align}
          category={category ? '일반' : undefined}
          currency={currency ? 'ETH' : undefined}
          copy={copy}
          onCopy={setCopied}
          tooltip={always ? 'always' : undefined}
        >
          {longValue ? '1,234.567890123456789012345678' : '1,234.5678'}
        </DataCell>
      </div>

      <span className="typo-caption-1 text-label-alternative">
        복사된 값: {copied ?? '없음'}
      </span>
    </div>
  );
};

export const Default: Story = {
  render: () => <Playground />,
};
