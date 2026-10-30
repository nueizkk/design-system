import { createContext, type ReactNode, useContext } from 'react';

import en from './locales/en.json';
import ko from './locales/ko.json';

/** DS가 문자열을 가진 언어. 번역이 추가되면 여기부터 넓힌다. */
export type LanguageType = 'ko' | 'en';

/**
 * 문자열 키의 기준은 소스 언어인 `ko`다. `en.json`에 키가 빠지면
 * `satisfies`가 컴파일 단계에서 잡는다 — 번역 누락이 빌드를 막는다.
 */
export type StringKeyType = keyof typeof ko;

const STRINGS = { ko, en } satisfies Record<LanguageType, Record<StringKeyType, string>>;

/**
 * 디자인 시스템은 소비앱의 i18n 스택(next-i18next, react-intl 등)에 의존하지
 * 않는다. 자기 UI 문구를 직접 들고 있고, 소비앱에서는 **언어만** 받는다.
 *
 * Provider가 없어도 `ko`로 동작한다 — 주입에 실패해도 화면이 깨지지 않는다.
 */
const LanguageContext = createContext<LanguageType>('ko');

export const DesignSystemProvider = ({
  language = 'ko',
  children,
}: {
  language?: LanguageType;
  children: ReactNode;
}) => (
  <LanguageContext.Provider value={language}>
    {children}
  </LanguageContext.Provider>
);

/** 현재 언어의 문자열 사전. `strings['no_data']`처럼 쓴다. */
export const useStrings = () => STRINGS[useContext(LanguageContext)];

/** 소비앱이 현재 언어를 읽어야 할 때(예: 날짜 포맷) 쓴다. */
export const useLanguage = () => useContext(LanguageContext);
