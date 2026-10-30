import {
  IListAppearance,
  List,
  ListOptionType,
  ListSectionType,
} from '../List';

export type AccordionOptionType = ListOptionType;
export type AccordionSectionType = ListSectionType;

interface IAccordionProps extends Pick<IListAppearance, 'indent'> {
  sections: AccordionSectionType[];
  defaultOpenValue?: string;
  defaultSelectedValue?: string;
  onOpenChange?: (openValue: string | null) => void;
  onSelect?: (sectionValue: string, optionValue: string) => void;
}

/**
 * 접고 펼치는 목록. 내부 구현은 비공개 `List`가 갖고 있고, 여기서는 **기본 외형만
 * 고정**한다 — 섹션 간격 없음, 밝은 배경 기준 색, 선택 시 글자색만 변경.
 *
 * 사이드바처럼 외형이 다른 쪽은 `List`를 직접 쓴다. 그래야 그쪽 요구가 이 공개
 * API로 새지 않는다.
 */
export function Accordion(props: IAccordionProps) {
  return <List {...props} />;
}
