import { ThemeType } from './config';

import * as Icon from '../../icons';

export interface IHeaderTheme {
  current: ThemeType;
  /** 누르면 반대 모드를 돌려준다. 어디에 저장할지는 소비앱이 정한다. */
  onChange: (theme: ThemeType) => void;
}

export const Theme = ({ current, onChange }: IHeaderTheme) => {
  /** 현재 테마가 아니라 "누르면 갈 테마"를 암시하는 아이콘을 보여준다. */
  const ThemeIcon = current === 'light' ? Icon.MoonSolid : Icon.SunSolid;

  return (
    <div
      onClick={() => onChange(current === 'dark' ? 'light' : 'dark')}
      className="bg-fill-normal interaction rounded-lg px-2 py-1 after:rounded-lg"
    >
      <ThemeIcon cursor="pointer" color="status-sub-cautionary" />
    </div>
  );
};
