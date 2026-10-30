import { LanguageType } from '../../i18n';

import { ThemeType } from './config';
import Language, { IHeaderLanguage } from './Language';
import Notice, { IHeaderNotice } from './Notice';
import { INotice } from './Notice/Item';
import Profile, { IHeaderProfile } from './Profile';
import { Theme, IHeaderTheme } from './Theme';
import { Logo } from '../Logo';
import Session, { IHeaderSession } from './Session';
import { cn } from '../utils/cn';

interface IHeaderProps {
  /**
   * 로그인 상태. 사이드바가 있는 화면이냐와 같은 말이라 축이 하나다 —
   * 로그인 전 화면(login·signup 등)에만 로고가 서고, 로그인 후에는 사이드바가
   * 로고를 가지므로 헤더에는 없다(Figma `login` variant).
   */
  login: boolean;
  /** 언어 칩. 안 넘기면 렌더되지 않는다. */
  language?: IHeaderLanguage;
  /** 밝기 모드 칩. 안 넘기면 렌더되지 않는다. */
  theme?: IHeaderTheme;
  /**
   * 사용자 영역. 이름·메뉴·로그인 핸들러를 한 자루로 받는다.
   *
   * 전에는 `name`과 `handler.myPage`·`handler.logout`·`handler.login`으로 흩어져
   * 있었다. `handler`에 Language·Notice 것까지 섞여 있어 어느 칩의 콜백인지
   * 알 수 없었다.
   */
  profile?: IHeaderProfile;
  /** 로고를 눌렀을 때. 넘기지 않으면 로고가 눌리지 않는다. */
  onClickLogo?: () => void;
  /**
   * 공지 칩. **안 넘기면 칩 자체가 없다** — admin처럼 공지 기능이 없는 서비스가
   * 그렇다. 빈 배열(`items: []`)은 "기능은 있으나 0건"이라 칩이 남는다.
   */
  notice?: IHeaderNotice;
  isLoading?: boolean;
  /**
   * 세션 타이머. **넘기지 않으면 타이머가 렌더되지 않는다** — 만료 시각을 모르는
   * 화면에서 0을 세고 있을 이유가 없다. `login={false}`에서는 애초에 쓰지 않는다.
   */
  session?: IHeaderSession;
}

export const Header = ({
  login,
  language,
  theme,
  onClickLogo,
  notice,
  profile,
  isLoading,
  session,
}: IHeaderProps) => {
  return (
    <div
      className={cn(
        CONTAINER,
        /** 로고가 없으면 붙일 짝이 없어 justify-between이 내용을 왼쪽으로 보낸다. */
        login ? 'justify-end' : 'justify-between',
      )}
    >
      {/**
        * 로고는 로그인 전에만 선다. 로그인 후에는 사이드바가 로고를 가진다.
        *
        * 전에는 `<a href="/login">`으로 경로가 박혀 있었다 — 디자인 시스템이
        * 소비앱의 라우트를 아는 결합이라 핸들러로 받는다.
        */}
      {!login && (
        <div
          className={cn(onClickLogo && 'cursor-pointer')}
          onClick={onClickLogo}
        >
          <Logo />
        </div>
      )}
      {isLoading ? null : (
        /**
         * 칩 순서는 login 상태와 무관하게 한 벌이다(Figma 11629:13558·11629:13482).
         * 타이머와 공지는 로그인 후에만 있고, 나머지 셋은 양쪽에 모두 있다.
         */
        <div className="flex items-center gap-5">
          {login && session && <Session {...session} />}
          <Profile login={login} {...profile} />
          {language && <Language {...language} />}
          {theme && <Theme {...theme} />}
          {/**
            * 공지 노출은 `notices` 전달 여부로만 정한다. `undefined`면 이 서비스에
            * 공지 기능이 없다는 뜻이고, `[]`면 기능은 있으나 0건이라는 뜻이다 —
            * 로딩 중에는 `[]`를 넘기면 트리거가 사라지지 않는다.
            */}
          {login && notice && <Notice {...notice} />}
        </div>
      )}
    </div>
  );
};

/**
 * Figma 실측(11629:13558·11629:13482)은 login 상태와 무관하게 68px이고
 * pt-5(20) + pb-4(16)이라 내용 영역이 정확히 32px다 — 하위 칩이 전부 32px이라
 * 맞아떨어진다. 문서에도 "이전엔 68/76이었으나 68로 통일"이라 적혀 있다.
 */
const CONTAINER =
  'sticky top-0 w-full h-[68px] px-10 pt-5 pb-4 flex items-center z-header bg-background-normal';

