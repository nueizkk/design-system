import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Table } from '..';
import * as Icon from '../../../icons';
import { cn } from '../../utils/cn';
import { ColumnType, SortDirectionType, TableSizeType } from '../types';

const meta: Meta<typeof Table> = {
  title: 'components/Table',
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

type TicketType = {
  id: string;
  /** 분류 라벨. 값 앞에 `[일반]` 꼴로 붙는다. */
  kind: '일반' | '대량' | 'OTC';
  symbol: string;
  network: string;
  company: string;
  txid: string;
  hasMemo: boolean;
  amount: string;
  status: '처리중' | '완료' | '실패';
  createdAt: string;
};

const SYMBOLS = ['ETH', 'BTC', 'POL', 'SOL', 'AVAX'] as const;
const NETWORKS = ['Ethereum', 'Bitcoin', 'Polygon', 'Solana', 'Avalanche'];
const COMPANIES = [
  '비댁스 주식회사',
  '한국디지털에셋',
  '아주 긴 회사 이름이 들어오는 경우를 보려고 늘린 이름',
];
const KINDS = ['일반', '대량', 'OTC'] as const;
const STATUSES = ['처리중', '완료', '실패'] as const;

/**
 * 페이지에 해당하는 행을 만들어낸다. 고정 배열이면 페이지를 넘겨도 같은 행이 보여
 * 페이지네이션이 도는지 확인할 수 없다.
 */
const makeRows = (page: number, pageSize: number, totalItems: number) => {
  const start = (page - 1) * pageSize;
  const count = Math.max(0, Math.min(pageSize, totalItems - start));

  return Array.from({ length: count }, (_, index) => {
    const no = start + index;
    const symbol = SYMBOLS[no % SYMBOLS.length];

    return {
      id: `${no + 1}`,
      kind: KINDS[no % KINDS.length],
      symbol,
      network: NETWORKS[no % NETWORKS.length],
      company: COMPANIES[no % COMPANIES.length],
      txid: `0x${(no + 1).toString(16).padStart(4, '0')}9f2c4b7e1a8d3f5c6b2e9a0d4f7c1b8e3a5d9f2c4b7e1a8d3f5c6b2e9a0d`,
      hasMemo: no % 3 === 0,
      amount: `${(no + 1).toLocaleString()}.567890123456789012345678`,
      status: STATUSES[no % STATUSES.length],
      createdAt: `2026-10-${String((no % 28) + 1).padStart(2, '0')} 09:21:04`,
    } satisfies TicketType;
  });
};

const STATUS_TYPE = {
  처리중: 'ongoing',
  완료: 'positive',
  실패: 'negative',
} as const;

/**
 * 소비앱의 출금 티켓 목록을 그대로 옮긴 것이다(admin `Tickets/Withdrawal`).
 *
 * 컬럼 하나가 헤더와 데이터를 함께 정한다 — `type`이 폭을, `align`이 정렬을 맡고
 * 둘이 어긋날 수 없다. 글자 칸은 `cell`로 가공만 하면 말줄임·툴팁·복사가 따라온다.
 *
 * 눈여겨볼 것:
 * - TXID·회사 이름이 길면 **말줄임 + hover 툴팁**
 * - 수량 칸에 네 조각이 다 있다 — `[분류] 값 단위 복사`. 툴팁은 분류·단위까지
 *   한 칸 띄워 잇고(`[일반] 1,234… ETH`), 복사는 **값만** 가져간다
 * - **행 클릭을 끄면** hover 음영과 손가락 커서가 같이 사라진다
 * - 데이터를 비우면 `NoData`가, 로딩을 켜면 스켈레톤이 **같은 높이**로 선다
 * - 페이지네이션은 `pagination` 자루를 넘겨야 뜬다. 0건이면 표와 함께 사라진다
 */
const Playground = () => {
  const [size, setSize] = useState<TableSizeType>('lg');
  const [clickable, setClickable] = useState(true);
  const [totalItems, setTotalItems] = useState(130);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<
    { key: string; direction: SortDirectionType } | undefined
  >({ key: 'amount', direction: 'desc' });
  const [log, setLog] = useState('행을 눌러보세요');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const rows = makeRows(page, pageSize, totalItems);

  const columns: ColumnType<TicketType>[] = [
    {
      key: 'symbol',
      type: 'icon',
      header: '',
      icon: () => <Icon.Wallet size="sm" color="label-neutral" />,
    },
    { key: 'network', type: 'middleText', header: '네트워크' },
    { key: 'company', type: 'middleText', header: '회사' },
    {
      key: 'txid',
      type: 'longText',
      header: 'TXID',
      copy: true,
      onCopy: (text) => setLog(`복사: ${text.slice(0, 14)}…`),
    },
    {
      key: 'hasMemo',
      type: 'icon',
      header: '',
      icon: (row) =>
        row.hasMemo ? (
          <Icon.Application size="sm" color="label-alternative" />
        ) : null,
    },
    {
      key: 'amount',
      type: 'middleText',
      header: '수량',
      align: 'right',
      sort: true,
      /** 값 앞에 `[일반]`이 붙는다 — 괄호는 라이브러리가 그린다. */
      category: (row) => row.kind,
      currency: (row) => row.symbol,
      copy: true,
      onCopy: (text) => setLog(`수량 복사: ${text}`),
      tooltip: 'always',
    },
    {
      key: 'status',
      type: 'status',
      header: '상태',
      status: (row) => ({ type: STATUS_TYPE[row.status], label: row.status }),
    },
    {
      key: 'createdAt',
      type: 'middleText',
      header: '요청 일시',
      align: 'right',
      sort: true,
    },
  ];

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

  return (
    <div className="flex flex-col gap-6 p-10">
      <div className="typo-caption-1 text-label-neutral flex items-center gap-2">
        <Toggle label="lg" on={size === 'lg'} onClick={() => setSize('lg')} />
        <Toggle label="sm" on={size === 'sm'} onClick={() => setSize('sm')} />
        <Toggle
          label="행 클릭"
          on={clickable}
          onClick={() => setClickable((v) => !v)}
        />
        <span className="flex items-center gap-1">
          건수
          {[0, 7, 130, 500].map((value) => (
            <Toggle
              key={value}
              label={`${value}`}
              on={totalItems === value}
              onClick={() => {
                setTotalItems(value);
                setPage(1);
              }}
            />
          ))}
        </span>
        <Toggle
          label="로딩"
          on={loading}
          onClick={() => setLoading((v) => !v)}
        />
        <span className="ml-2">
          {log}
          {sort && ` · 정렬: ${sort.key} ${sort.direction}`}
          {` · ${page}페이지 (${rows.length}행 / 총 ${totalItems}건)`}
        </span>
      </div>

      {/** 본문 폭(1248) 안에 놓인 상황을 재현한다. */}
      <div className="w-full max-w-[1248px]">
        <Table
          columns={columns}
          data={rows}
          rowKey={(row) => row.id}
          size={size}
          isLoading={loading}
          sort={{ ...sort, onChange: setSort }}
          onRowClick={
            clickable
              ? (row: TicketType) => setLog(`${row.symbol} 행 클릭`)
              : undefined
          }
          pagination={{ page, totalItems, pageSize, onPageChange: setPage }}
        />
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <Playground />,
};
