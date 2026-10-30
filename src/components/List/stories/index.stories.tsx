import type { Meta, StoryObj } from '@storybook/react-vite';

import { List, ListSectionType } from '..';
import * as Icon from '../../../icons';

/**
 * `List`는 `Option`과 마찬가지로 내보내지 않는 조립 부품이다. 이 스토리는
 * `Accordion`과 `Sidebar`가 어떤 축을 달리 잡아 쓰는지 보기 위한 것이다.
 */
const meta: Meta<typeof List> = {
  title: 'components/List',
  component: List,
};

export default meta;

type Story = StoryObj<typeof List>;

const sections: ListSectionType[] = [
  {
    label: '대시보드',
    value: 'dashboard',
    icon: Icon.Dashboard,
    /** 비면 펼칠 것이 없어 쉐브론이 사라지고 헤더 자체가 선택이 된다. */
    options: [],
  },
  {
    label: '입금 관리',
    value: 'deposit',
    icon: Icon.Deposit,
    options: [
      { label: '입금 내역', value: 'deposit-history' },
      { label: '입금 주소', value: 'deposit-address' },
    ],
  },
  {
    label: '활동 로그',
    value: 'log',
    icon: Icon.ActivityLog,
    options: [
      { label: '전체 로그', value: 'log-all' },
      { label: '로그인 이력', value: 'log-signin', disabled: true },
    ],
  },
];

/** `Accordion`이 쓰는 조합 — 간격 없음, 밝은 배경 기준 색, 헤더 배경 없음. */
export const AccordionDefaults: Story = {
  render: () => (
    <div style={{ width: 456 }}>
      <List sections={sections} defaultOpenValue="deposit" />
    </div>
  ),
};

/** `Sidebar`가 쓰는 조합 — 12px 간격, 선택된 헤더에 배경. */
export const SidebarDefaults: Story = {
  render: () => (
    <div style={{ width: 220 }}>
      <List
        sections={sections}
        gap="md"
        activeHeaderBackground
        indent
        defaultOpenValue="deposit"
        defaultSelectedValue="dashboard"
      />
    </div>
  ),
};

/** 어두운 사이드바용 — 색만 `static-white`로 바뀐다. */
export const OnDarkSurface: Story = {
  render: () => (
    <div style={{ width: 220, padding: 20, background: '#122146' }}>
      <List
        sections={sections}
        color="static-white"
        gap="md"
        activeHeaderBackground
        indent
        defaultOpenValue="deposit"
        defaultSelectedValue="dashboard"
      />
    </div>
  ),
};
