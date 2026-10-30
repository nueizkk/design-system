import { LanguageType } from '../../i18n';

import * as Icon from '../../icons';

export interface IHeaderLanguage {
  current: LanguageType;
  /**
   * 누르면 반대 언어를 돌려준다. 전에는 `ko`·`en` 콜백을 따로 받아, 언어가 늘면
   * prop도 늘어나는 구조였다.
   */
  onChange: (language: LanguageType) => void;
}

/**
 * 헤더의 언어 칩. `Theme`과 같은 토글이다 — 누르면 바로 반대 언어로 바뀐다.
 *
 * 전에는 드롭다운에서 골랐다. 선택지가 둘뿐이라 메뉴를 펼쳐 한 번 더 누르게 할
 * 이유가 없었다. **셋 이상이 되면 토글로는 안 되니 드롭다운으로 되돌려야 한다.**
 */
function Language({ current, onChange }: IHeaderLanguage) {
  /** 테마와 달리 **현재** 언어를 보여준다 — 글리프가 곧 지금 읽고 있는 언어다. */
  const CurrentLanguageIcon = current === 'ko' ? Icon.Kor : Icon.Eng;

  return (
    /**
     * Figma `Header/Language`는 `Header/Theme`과 완전히 같은 칩이다
     * (fill-normal · px-2 py-1 · radius lg). py-1 + 아이콘 24 = 높이 32.
     *
     * `color`는 넘기지 않는다 — Kor·Eng는 글리프에 색이 박힌 고정색 아이콘이라
     * 따르지 않는다(`icons/Kor.tsx` 주석 참고).
     */
    <div
      onClick={() => onChange(current === 'ko' ? 'en' : 'ko')}
      className="bg-fill-normal interaction rounded-lg px-2 py-1 after:rounded-lg"
    >
      <CurrentLanguageIcon cursor="pointer" />
    </div>
  );
}

export default Language;
