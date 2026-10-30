import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Layout } from '..';
import { Footer } from '../../Footer';
import { Header } from '../../Header';
import { ThemeType } from '../../Header/config';
import { INotice } from '../../Header/Notice/Item';
import { Sidebar } from '../../Sidebar';
import { SidebarItemType, SidebarVariantType } from '../../Sidebar/config';
import { DesignSystemProvider, LanguageType } from '../../../i18n';
import * as Icon from '../../../icons';

const meta: Meta<typeof Layout> = {
  title: 'components/Layout',
  component: Layout,
};
export default meta;

type Story = StoryObj<typeof Layout>;

const MENUS: SidebarItemType[] = [
  { value: '/', label: '대시보드', icon: Icon.Dashboard },
  { value: '/organization', label: '조직', icon: Icon.Building },
  { value: '/members', label: '회원 관리', icon: Icon.Profile },
  {
    value: '/support',
    label: '고객센터',
    icon: Icon.Support,
    items: [
      { value: '/support/notice', label: '공지사항' },
      { value: '/support/faq', label: '자주 묻는 질문' },
    ],
  },
];

const NOTICES: INotice[] = [
  {
    id: '1',
    title: '정기 점검 안내',
    isRead: false,
    isImportant: true,
    createdAt: '2026-10-10T09:00:00Z',
  },
];

const Body = () => (
  <div className="typo-body-2 text-label-normal">
    본문. 사이드바를 접었다 펴면 헤더와 본문이 함께 따라온다.
    <div className="h-[2400px]" />
    본문 끝
  </div>
);

/**
 * 로그아웃 → 로그인을 실제로 오가는 플레이그라운드.
 *
 * **사이드바와 푸터는 로그인한 뒤에만 선다.** 로그인 전 화면(login·signup 등)은
 * 헤더와 본문뿐이다 — 두 슬롯에 아무것도 안 넘기면 그만이라, 자리를 비워두는
 * 처리가 따로 필요하지 않다.
 *
 * 사이드바를 접었다 펴면 헤더·본문·푸터가 함께 따라온다. `Layout`이 사이드바 폭을
 * 모르는데도 되는 이유는 본문 컬럼이 `flex-1`로 남는 공간을 가져가기 때문이다.
 */
const Playground = ({
  variant,
  notice,
  footer,
}: {
  variant: SidebarVariantType;
  notice: boolean;
  footer: boolean;
}) => {
  const [login, setLogin] = useState(false);
  const [language, setLanguage] = useState<LanguageType>('ko');
  const [theme, setTheme] = useState<ThemeType>('light');
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState('/');
  /** 로그인할 때마다 2시간짜리 세션이 새로 시작한다. */
  const [expiresAt, setExpiresAt] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    /** 다른 스토리로 넘어갈 때 다크가 묻어가지 않도록 되돌린다. */
    return () => document.documentElement.classList.remove('dark');
  }, [theme]);

  return (
    /** 언어 칩을 누르면 DS 문구("로그인"·"공지사항")까지 같이 바뀐다. */
    <DesignSystemProvider language={language}>
      <Layout
        sidebar={
          login ? (
            <Sidebar
              items={MENUS}
              value={value}
              onSelect={setValue}
              open={open}
              onOpenChange={setOpen}
              variant={variant}
              footer={{ companyName: 'DS' }}
            />
          ) : undefined
        }
        header={
          <Header
            login={login}
            session={
              login
                ? { expiresAt, warningBefore: 5 * 60 * 1000, onExtend: () => {} }
                : undefined
            }
            profile={{
              name: '홍길동님',
              menu: [
                [{ value: 'my_page', label: '마이페이지', onClick: () => {} }],
                [
                  {
                    value: 'logout',
                    label: '로그아웃',
                    negative: true,
                    onClick: () => setLogin(false),
                  },
                ],
              ],
              onClickLogin: () => {
                setExpiresAt(Date.now() + 2 * 60 * 60 * 1000);
                setLogin(true);
              },
            }}
            language={{ current: language, onChange: setLanguage }}
            theme={{ current: theme, onChange: setTheme }}
            notice={notice && login ? { items: NOTICES } : undefined}
          />
        }
        footer={
          footer && login ? (
            <Footer
              actions={[
                { label: '이용약관', onClick: () => {} },
                { label: '개인정보처리방침', onClick: () => {}, bold: true },
              ]}
              info={[
                { label: '고객센터', value: 'cs@0529th.com' },
                { value: '서울특별시 강남구 테헤란로 38길 5, 2층' },
              ]}
            />
          ) : undefined
        }
      >
        <Body />
      </Layout>
    </DesignSystemProvider>
  );
};

/**
 * 클라이언트. 사이드바는 중립 배경(`neutral`)이고 공지 칩과 푸터가 있다.
 *
 * Figma Grid 예시(`12058:2438`·`12058:3667`·`12289:6300`)가 전부 사이드바와 푸터를
 * 함께 그린다. 푸터는 본문과 달리 1248px 상한 없이 컬럼을 꽉 채운다.
 */
export const Client: Story = {
  render: () => <Playground variant="neutral" notice footer />,
};

/**
 * 어드민. 사이드바가 브랜드 색 배경(`primary`)이고, 공지 칩도 푸터도 없다.
 *
 * 같은 `Layout`에 재료만 바꿔 꽂은 것이다 — 서비스 종류를 아는 prop은 어디에도
 * 없다. 사이드바는 `variant`라는 **외형** 축으로, 공지와 푸터는 그 자리에 아무것도
 * 안 넘기는 것으로 갈린다. 푸터가 없으면 본문이 바닥까지 내려온다(`main`이
 * `flex-1`이라 남는 높이를 가져간다).
 */
export const Admin: Story = {
  render: () => <Playground variant="primary" notice={false} footer={false} />,
};
