import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Header } from '..';
import { ThemeType } from '../config';
import { INotice } from '../Notice/Item';
import { DesignSystemProvider, LanguageType } from '../../../i18n';

const meta: Meta<typeof Header> = {
  title: 'components/Header',
  component: Header,
};
export default meta;

type Story = StoryObj<typeof Header>;

const NOTICES: INotice[] = [
  {
    id: '1',
    title: '정기 점검 안내',
    isRead: false,
    isImportant: true,
    createdAt: '2026-10-10T09:00:00Z',
  },
  {
    id: '2',
    title: '출금 수수료 정책 변경',
    isRead: true,
    isImportant: false,
    createdAt: '2026-10-08T09:00:00Z',
  },
];

/** 세션 타이머에 넘길 값. 만료 시각을 prop으로 주므로 쿠키를 심을 필요가 없다. */
const SESSION = {
  warningBefore: 5 * 60 * 1000,
  notifyBefore: [30 * 60 * 1000, 5 * 60 * 1000],
  onReach: (ms: number) => console.log(`남은 시간 ${ms / 60000}분`),
  onExpire: () => console.log('세션 만료'),
  onExtend: () => console.log('연장'),
};

/**
 * Header는 `sticky`라 흐름 안에 있다 — 자리를 비워줄 필요가 없고, 스크롤하면
 * 상단에 붙는다. 본문을 길게 둬서 그 동작을 확인할 수 있다.
 */
const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-background-alternative flex min-h-screen flex-col">
    {children}
    <div className="typo-caption-1 text-label-alternative flex-1 px-10 py-4">
      본문. 스크롤하면 헤더가 상단에 붙는다.
      <div className="h-[2400px]" />
      본문 끝
    </div>
  </div>
);

/**
 * 로그아웃 → 로그인을 실제로 오가는 플레이그라운드.
 *
 * "로그인"을 누르면 로그인 상태가 되고, 이름 칩의 드롭다운에서 "로그아웃"을 누르면
 * 되돌아온다. 로그인 여부로 바뀌는 것은 세 가지다 — 로고(비로그인에만), 세션 타이머와
 * 공지(로그인에만), 프로필 칩의 모양.
 *
 * 언어·테마도 실제로 바뀐다. 테마는 `<html>`의 `dark` 클래스를 직접 켜고 끄므로
 * Storybook 상단의 Backgrounds 툴바와 서로 덮어쓴다 — 여기서는 칩으로만 바꾼다.
 */
const Playground = ({ notice }: { notice: boolean }) => {
  const [login, setLogin] = useState(false);
  const [language, setLanguage] = useState<LanguageType>('ko');
  const [theme, setTheme] = useState<ThemeType>('light');
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
      <Frame>
        <Header
          login={login}
          session={login ? { ...SESSION, expiresAt } : undefined}
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
          onClickLogo={() => console.log('로고 클릭')}
        />
      </Frame>
    </DesignSystemProvider>
  );
};

/** 클라이언트. 로그인하면 시간·프로필·언어·테마·공지 다섯 칩이 선다. */
export const Client: Story = {
  render: () => <Playground notice />,
};

/**
 * 어드민. 공지 기능이 없어 `notice` 자루를 아예 안 넘긴다 — 칩도 없다.
 * 자루 생략이 곧 구성 차이를 표현하는 방법이다.
 */
export const Admin: Story = {
  render: () => <Playground notice={false} />,
};

/** 남은 시간이 `warningBefore`(5분) 아래 — 시간 글자만 경고색이 된다. "연장"은 그대로. */
export const ExpiringSoon: Story = {
  render: () => (
    <Frame>
      <Header
        login
        profile={{ name: '홍길동님' }}
        language={{ current: 'ko', onChange: () => {} }}
        theme={{ current: 'light', onChange: () => {} }}
        session={{ ...SESSION, expiresAt: Date.now() + 3 * 60 * 1000 }}
        notice={{ items: NOTICES }}
      />
    </Frame>
  ),
};
