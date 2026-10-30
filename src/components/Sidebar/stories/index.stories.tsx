import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Sidebar } from '..';
import { SidebarItemType } from '../config';
import * as Icon from '../../../icons';

const meta: Meta<typeof Sidebar> = {
  title: 'components/Sidebar',
  component: Sidebar,
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

/** 메뉴는 소비앱이 만든다 — DS는 경로도 역할도 모른다. */
const CLIENT_MENUS: SidebarItemType[] = [
  { value: '/', label: '대시보드', icon: Icon.Dashboard },
  { value: '/organization', label: '조직', icon: Icon.Building },
  { value: '/members', label: '회원 관리', icon: Icon.Profile },
  { value: '/billing', label: '결제 관리', icon: Icon.Creditcard },
  { value: '/activity', label: '활동 로그', icon: Icon.ActivityLog },
  {
    value: '/support',
    label: '고객센터',
    icon: Icon.Support,
    items: [
      { value: '/support/notice', label: '공지사항' },
      { value: '/support/faq', label: '자주 묻는 질문' },
      { value: '/support/inquiry', label: '1:1 문의' },
    ],
  },
];

const ADMIN_MENUS: SidebarItemType[] = [
  { value: '/', label: '대시보드', icon: Icon.Dashboard },
  {
    value: '/orders',
    label: '주문 관리',
    icon: Icon.Settlement,
    items: [
      { value: '/orders/list', label: '주문 내역' },
      { value: '/orders/refund', label: '취소·환불' },
    ],
  },
  {
    value: '/activity',
    label: '활동 로그',
    icon: Icon.ActivityLog,
    items: [
      { value: '/activity/user', label: '유저 활동 로그' },
      { value: '/activity/admin', label: '어드민 활동 로그' },
    ],
  },
  {
    value: '/roles',
    label: '권한 관리',
    icon: Icon.Role,
    items: [
      { value: '/roles/members', label: '멤버 권한' },
      { value: '/roles/policy', label: '접근 정책' },
    ],
  },
];

const Demo = ({
  menus,
  variant,
}: {
  menus: SidebarItemType[];
  variant: 'neutral' | 'primary';
}) => {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState('/');

  return (
    <div style={{ height: '100vh' }}>
      <Sidebar
        items={menus}
        variant={variant}
        open={open}
        onOpenChange={setOpen}
        value={active}
        onSelect={setActive}
        footer={{ companyName: 'DS Organization' }}
      />
    </div>
  );
};

/** 소비앱은 표면 종류만 말한다 — 배경·글자색·로고는 전부 거기서 파생된다. */
export const Neutral: Story = {
  render: () => <Demo menus={CLIENT_MENUS} variant="neutral" />,
};

export const Primary: Story = {
  render: () => <Demo menus={ADMIN_MENUS} variant="primary" />,
};
