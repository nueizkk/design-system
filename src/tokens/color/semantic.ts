import { OpacityType } from '../opacity';

import { colors } from './palette';

/**
 * light가 원본이고, dark는 이 타입을 그대로 적용받아 키 누락·초과를 컴파일 타임에 잡는다
 * (darkSemanticColors의 타입 주석 참고). 예전엔 & 교집합이라 한쪽에만 키를 빠뜨려도
 * 에러 없이 조용히 타입에서 빠졌다.
 */
export type TokenSemanticColorType = keyof typeof lightSemanticColors;

/**
 * opacity 조합(`/{opacity}`)을 만들면 안 되는 시맨틱 컬러 이름 목록.
 *
 * 이 색들은 dark 모드 등에서 `hex6ToHex8(...)`로 값 자체에 이미 알파가 섞여 있다
 * (예: material-dim, dark의 line-*·fill-*). 여기에 opacity 토큰을 또 얹으면 설계된
 * 농도가 조용히 다른 값으로 덮어써진다.
 *
 * hex 값을 보고 자동으로 판별하지 않고 직접 나열하는 이유: `hex6ToHex8`의 리턴 타입이
 * `string`이라 결과가 몇 자리 hex인지는 런타임에만 정해진다. TypeScript는 코드를
 * 실행하지 않고 선언된 타입만 보므로, 컴파일 타임에 "이 색은 opacity를 못 받는다"를
 * 판단하려면 그 사실을 한 번은 값으로 직접 선언해야 한다.
 *
 * 색상값이 바뀌어 이 목록이 실제 hex8 여부와 달라지면(hex8 색이 추가/제거되면) 여기도
 * 같이 고친다.
 */
export const BAKED_OPACITY_COLOR_NAMES = [
  'material-dim',
  'line-normal',
  'line-strong',
  'line-neutral',
  'line-alternative',
  'fill-normal',
  'fill-strong',
  'fill-alternative',
] as const;

export type BakedOpacityColorNamesType = (typeof BAKED_OPACITY_COLOR_NAMES)[number];

/**
 * name이 opacity 조합을 만들면 안 되는 색상(BAKED_OPACITY_COLOR_NAMES)인지 판별한다.
 *
 * getColors(theme.colors 키 생성)와 setColors(실제 CSS 변수 주입, src/tailwind.ts)가
 * 이 함수를 공유해서 "opacity 조합 불가" 판단 기준을 하나로 유지한다.
 *
 * @param name 시맨틱 컬러 이름
 * @returns name이 BAKED_OPACITY_COLOR_NAMES에 있으면 true (타입가드)
 */
export const hasBakedOpacity = (name: string): name is BakedOpacityColorNamesType =>
  (BAKED_OPACITY_COLOR_NAMES as readonly string[]).includes(name);

export type TokenSemanticColorWithOpacityType =
  | `${Exclude<TokenSemanticColorType, BakedOpacityColorNamesType>}/${OpacityType}`
  | TokenSemanticColorType;

const hex6ToHex8 = (hex6: string, opacityPercent: number): string => {
  if (hex6 === 'transparent') return 'transparent';
  const alpha = Math.round((opacityPercent / 100) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
  return `${hex6}${alpha}`;
};

export const lightSemanticColors = {
  transparent: colors.transparent,

  'static-white': colors.white,
  'static-black': colors.black,

  'primary-normal': colors['blue-100'],
  'primary-heavy': colors['blue-400'],
  'primary-light': colors['blue-80'],

  'label-normal': colors['gray-90'],
  'label-strong': colors.black,
  'label-neutral': colors['gray-60'],
  'label-alternative': colors['gray-40'],
  'label-assistive': colors['gray-30'],
  'label-disable': colors['gray-10'],

  'interaction-active': colors['blue-10'],
  'interaction-hover': colors['blue-50'],
  'interaction-disable': colors['gray-5'],

  'line-normal': colors['indigo-30'],
  'line-strong': colors['indigo-60'],
  'line-neutral': colors['indigo-2'],
  'line-alternative': colors['indigo-1'],

  'background-normal': colors.white,
  'background-overlay': colors.white,
  'background-alternative': colors['indigo-1'],
  'background-elevated': colors.white,

  'material-dim': hex6ToHex8(colors['gray-90'], 28),

  'fill-normal': colors['navy-2'],
  'fill-strong': colors['navy-30'],
  'fill-alternative': colors['navy-1'],

  'status-main-positive': colors['green-100'],
  'status-main-standby': colors['blue-100'],
  'status-main-off': colors['gray-20'],
  'status-main-cautionary': colors['orange-80'],
  'status-main-negative': colors['red-100'],

  'status-sub-positive': colors['green-80'],
  'status-sub-cautionary': colors['yellow-50'],
  'status-sub-negative': colors['red-80'],
};

// 타입 주석으로 light와 키가 정확히 일치하는지 강제한다(빠지거나 초과되면 컴파일 에러).
export const darkSemanticColors: Record<TokenSemanticColorType, string> = {
  transparent: colors.transparent,

  'static-white': colors.white,
  'static-black': colors.black,

  'primary-normal': colors['blue-100'],
  'primary-heavy': colors['blue-300'],
  'primary-light': colors['blue-80'],

  'label-normal': colors['gray-5'],
  'label-strong': colors.white,
  'label-neutral': colors['gray-10'],
  'label-alternative': colors['gray-30'],
  'label-assistive': colors['gray-40'],
  'label-disable': colors['gray-50'],

  'interaction-active': colors['blue-10'],
  'interaction-hover': colors['blue-40'],
  'interaction-disable': colors['gray-60'],

  'line-normal': hex6ToHex8(colors['indigo-60'], 24),
  'line-strong': hex6ToHex8(colors['indigo-50'], 56),
  'line-neutral': hex6ToHex8(colors['indigo-100'], 24),
  'line-alternative': hex6ToHex8(colors['indigo-100'], 12),

  'background-normal': colors['gray-90'],
  'background-overlay': colors['gray-80'],
  'background-alternative': colors['gray-85'],
  'background-elevated': colors['gray-75'],

  'material-dim': hex6ToHex8(colors['gray-90'], 40),

  'fill-normal': hex6ToHex8(colors['navy-2'], 12),
  'fill-strong': hex6ToHex8(colors['navy-2'], 20),
  'fill-alternative': hex6ToHex8(colors['navy-1'], 8),

  'status-main-positive': colors['green-100'],
  'status-main-standby': colors['blue-80'],
  'status-main-off': colors['gray-40'],
  'status-main-cautionary': colors['orange-80'],
  'status-main-negative': colors['red-100'],

  'status-sub-positive': colors['green-80'],
  'status-sub-cautionary': colors['yellow-50'],
  'status-sub-negative': colors['red-80'],
};
