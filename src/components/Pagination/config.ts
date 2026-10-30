import { TokenSemanticColorType } from 'tokens';

/** 갈 곳이 없는 화살표는 흐려진다(Figma `Pagination/Arrow`의 `disabled`). */
export const getPageIconColor: (active: boolean) => TokenSemanticColorType = (
  active: boolean,
) => (active ? 'label-normal' : 'label-disable');
