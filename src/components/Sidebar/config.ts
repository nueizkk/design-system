import { ListOptionType } from '../List';
import { IconComponentType } from '../../icons';

/**
 * 메뉴는 **소비앱이 주입한다.** 디자인 시스템은 경로도, 역할별 구성도, 라벨의
 * 뜻도 모른다 — 받은 순서대로 그릴 뿐이다.
 *
 * 이전에는 여기에 역할(SUPER/OPERATION/AML/FINANCE)별 메뉴 70개가 경로·아이콘과
 * 함께 박혀 있었다. "서비스 도메인 지식은 디자인 시스템에 남기지 않는다"는
 * 원칙의 전형적인 위반이라 걷어냈다(compat 레이어도 같은 이유로 소멸).
 */
/**
 * 메뉴 한 줄. 실제로 그려지는 것은 `List`의 옵션이므로 그 타입에서 필요한
 * 것만 골라 쓴다 — 같은 모양을 두 곳에 적어두면 한쪽만 바뀐다.
 *
 * - `value` — 선택을 식별하는 값. 보통 라우트 경로를 그대로 쓴다.
 * - `label` — **이미 번역된** 라벨. DS는 i18n 키를 받지 않는다.
 *
 * `indent`는 상위 메뉴의 아이콘 유무로 계산되므로 가져오지 않는다.
 */
export type SidebarSubItemType = Pick<ListOptionType, 'value' | 'label'>;

export interface SidebarItemType extends SidebarSubItemType {
  icon?: IconComponentType;
  /** 있으면 아코디언으로, 없으면 단일 항목으로 그린다. */
  items?: SidebarSubItemType[];
}

/**
 * 사이드바 표면의 종류. `neutral`은 중립 배경, `primary`는 브랜드 색 배경이다.
 * 색은 전부 여기서 파생되므로 하위 컴포넌트도 색이 아니라 이 값을 받는다.
 */
export type SidebarVariantType = 'neutral' | 'primary';
