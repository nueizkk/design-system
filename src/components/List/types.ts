import type { IOptionProps } from '../Option';
import { IconComponentType } from '../../icons';

export type ListOptionType = Pick<IOptionProps, 'value' | 'label' | 'disabled'>;

export interface ListSectionType {
  label: string;
  value: string;
  icon?: IconComponentType;
  /** 비면 펼칠 것이 없어 쉐브론이 사라지고 헤더 자체가 선택이 된다. */
  options: ListOptionType[];
}

/** 섹션 사이 간격. 값이 늘면 여기서만 늘린다. */
export type ListGapType = 'none' | 'md';

export interface IListAppearance {
  /** 기본 텍스트·아이콘 색. 어두운 배경에서는 `static-white`. Option에 그대로 내려간다. */
  color?: IOptionProps['color'];
  gap?: ListGapType;
  /**
   * 선택된 헤더에 배경을 깐다. `Accordion`은 글자색만 바뀌지만, 사이드바 메뉴는
   * 선택된 항목이 한눈에 보여야 해서 배경이 필요하다.
   */
  activeHeaderBackground?: boolean;
  /**
   * 하위 옵션을 아이콘 한 칸만큼 들여쓴다. 헤더가 아이콘을 가질 때 하위 글자가
   * 헤더 글자와 같은 선에서 시작하게 하는 용도다.
   *
   * 목록 전체에 한 번에 걸린다. 옵션마다 따로 켜면 같은 묶음 안에서 시작선이
   * 들쭉날쭉해지므로 옵션에는 두지 않는다.
   */
  indent?: boolean;
}
