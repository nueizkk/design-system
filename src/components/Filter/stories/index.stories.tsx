import { useState } from 'react';


import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Filter,
  DateFilter,
  InputFilter,
  SelectFilter,
  StatusFilter,
} from '..';
import type { IStatusOption } from '../Preset/StatusFilter/config';
import * as Icon from '../../../icons';

const meta: Meta<typeof Filter> = {
  title: 'components/Filter',
  component: Filter,
};

export default meta;

type Story = StoryObj<typeof Filter>;

const FilterDemo = () => {
  const [isFiltered, setIsFiltered] = useState(false);

  return (
    <Filter
      active={isFiltered}
      title="text"
      onRemoveFilter={() => setIsFiltered(false)}
    >
      <Filter.Chip icon={Icon.Calendar} />
      <Filter.Dropdown
        onDeselect={() => setIsFiltered(false)}
        onSubmit={() => setIsFiltered(true)}
      >
        <p className="typo-body-2 text-label-normal">필터 옵션 영역</p>
      </Filter.Dropdown>
    </Filter>
  );
};

export const Default: Story = {
  render: () => <FilterDemo />,
};

const DateDemo = () => {
  const [range, setRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({ startDate: null, endDate: null });

  return (
    <div className="flex flex-col gap-4">
      <DateFilter
        title="날짜"
        icon={Icon.Calendar}
        value={range}
        onChange={setRange}
      />
      <pre className="typo-caption-1 bg-background-normal border-line-normal text-label-neutral w-fit rounded-sm border px-3 py-2">
        value = {JSON.stringify(range, null, 2)}
      </pre>
    </div>
  );
};

export const Date: Story = {
  render: () => <DateDemo />,
};

const STATUS_OPTIONS: IStatusOption[] = [
  {
    label: '입금',
    value: 'deposit',
    children: [
      { label: '입금 확인중', value: 'depositPending', type: 'ongoing' },
      { label: '담당자 확인중', value: 'depositReview', type: 'ongoing' },
      { label: '고객 확인중', value: 'depositCustomer', type: 'cautionary' },
      { label: '입금 완료', value: 'depositComplete', type: 'positive' },
      { label: '입금 반려', value: 'depositRejected', type: 'negative' },
    ],
  },
  {
    label: '출금',
    value: 'withdrawal',
    children: [
      {
        /** 둘 다 선택되면 'withdrawalReview' 하나로 접혀서 나간다 */
        label: '어드민 리뷰',
        value: 'withdrawalReview',
        collapsible: true,
        children: [
          { label: '1차 어드민 리뷰', value: 'withdrawalFirst', type: 'cautionary' },
          { label: '2차 어드민 리뷰', value: 'withdrawalSecond', type: 'cautionary' },
        ],
      },
      { label: '출금 진행중', value: 'withdrawalOngoing', type: 'ongoing' },
      { label: '출금 완료', value: 'withdrawalComplete', type: 'positive' },
      { label: '출금 실패', value: 'withdrawalFailed', type: 'negative' },
      { label: '출금 취소', value: 'withdrawalCanceled', type: 'off' },
    ],
  },
];

const StatusDemo = () => {
  /** 쿼리 파라미터에서 읽어온 값으로 시작하는 상황을 가정 */
  const [statusValues, setStatusValues] = useState<string[]>([
    'depositPending',
    'depositReview',
  ]);

  return (
    <div className="flex flex-col gap-4">
      <StatusFilter
        title="상태"
        icon={Icon.Status}
        options={STATUS_OPTIONS}
        value={statusValues}
        onChange={setStatusValues}
      />
      {/* collapsible이 켜진 노드가 하나로 접혀 나가는 걸 눈으로 확인하는 용도 */}
      <pre className="typo-caption-1 bg-background-normal border-line-normal text-label-neutral w-fit rounded-sm border px-3 py-2">
        value = {JSON.stringify(statusValues, null, 2)}
      </pre>
    </div>
  );
};

export const Status: Story = {
  render: () => <StatusDemo />,
};

const SELECT_ITEMS = [
  { label: '로그인', value: 'login' },
  { label: '계정정보', value: 'account' },
  { label: '법인정보', value: 'corp' },
  { label: '플랫폼 지갑', value: 'platformWallet' },
  { label: '입금', value: 'deposit' },
  { label: '출금', value: 'withdrawal' },
  { label: '고객 지갑', value: 'customerWallet' },
];

const SelectDemo = () => {
  const [single, setSingle] = useState<string | null>(null);
  const [multiple, setMultiple] = useState<string[]>([]);

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col gap-4">
        <SelectFilter
          title="단일 선택"
          icon={Icon.Status}
          items={SELECT_ITEMS}
          value={single}
          onChange={setSingle}
        />
        <pre className="typo-caption-1 bg-background-normal border-line-normal text-label-neutral w-fit rounded-sm border px-3 py-2">
          value = {JSON.stringify(single)}
        </pre>
      </div>
      <div className="flex flex-col gap-4">
        <SelectFilter
          type="multiple"
          title="다중 선택"
          icon={Icon.Status}
          items={SELECT_ITEMS}
          value={multiple}
          onChange={setMultiple}
        />
        <pre className="typo-caption-1 bg-background-normal border-line-normal text-label-neutral w-fit rounded-sm border px-3 py-2">
          value = {JSON.stringify(multiple, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const Select: Story = {
  render: () => <SelectDemo />,
};

const InputDemo = () => {
  const [keyword, setKeyword] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col gap-4">
        <InputFilter
          title="검색어"
          icon={Icon.Text}
          inputs={[
            {
              name: 'keyword',
              placeholder: '입력하세요',
              value: keyword,
              onChange: setKeyword,
            },
          ]}
        />
        <pre className="typo-caption-1 bg-background-normal border-line-normal text-label-neutral w-fit rounded-sm border px-3 py-2">
          keyword = {JSON.stringify(keyword)}
        </pre>
      </div>
      {/* inputs를 여러 개 주면 금액 범위처럼 세로로 쌓인다 */}
      <div className="flex flex-col gap-4">
        <InputFilter
          title="금액"
          icon={Icon.CircleDollar}
          inputs={[
            {
              name: 'min',
              label: '최소',
              placeholder: '0.0000',
              unit: 'BTC',
              value: min,
              onChange: setMin,
            },
            {
              name: 'max',
              label: '최대',
              placeholder: '1.0000',
              unit: 'BTC',
              value: max,
              onChange: setMax,
            },
          ]}
        />
        <pre className="typo-caption-1 bg-background-normal border-line-normal text-label-neutral w-fit rounded-sm border px-3 py-2">
          min = {JSON.stringify(min)}
          {'\n'}max = {JSON.stringify(max)}
        </pre>
      </div>
    </div>
  );
};

export const Input: Story = {
  render: () => <InputDemo />,
};
