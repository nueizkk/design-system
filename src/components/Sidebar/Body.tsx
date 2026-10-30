import { SidebarItemType, SidebarVariantType } from './config';
import { List } from '../List';
import { cn } from '../utils/cn';
import { TokenSemanticColorType } from 'tokens';

interface ICollapsedMenuProps {
  items: SidebarItemType[];
  value?: string;
  onSelect: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  color: TokenSemanticColorType;
}

/**
 * 접힌 rail의 메뉴. 하위 항목 펼침과 무관하게 **아이콘만** 보인다(Figma Sidebar
 * 문서). 항목은 60×40이고 아이콘은 그 안에서 중앙 정렬이다(Figma 11857:16473).
 *
 * 96px 폭에 패널을 띄울 수 없으므로, 하위가 있는 메뉴를 누르면 선택 대신 rail을
 * 먼저 펼친다.
 */
function CollapsedMenu({
  items,
  value,
  onSelect,
  onOpenChange,
  color,
}: ICollapsedMenuProps) {
  /** 자기 자신이든 하위 항목이든 선택돼 있으면 그 메뉴가 활성이다. */
  const isActive = (item: SidebarItemType) =>
    item.value === value ||
    !!item.items?.some((subItem) => subItem.value === value);

  return items.map((item) => {
    const ItemIcon = item.icon;
    if (!ItemIcon) return null;

    const active = isActive(item);

    return (
      <button
        key={item.value}
        type="button"
        aria-label={item.label}
        onClick={() =>
          item.items?.length ? onOpenChange(true) : onSelect(item.value)
        }
        /**
         * 52×40은 Figma `Sidebar/Menu`의 `expanded=false`(`37323:1406`) 실측이다.
         * 선택 배경은 그 안의 `active-bg`로, 펼친 상태와 같은 `Interaction/Active`다.
         * 모서리는 Figma에서 변수로 안 묶여 있어 펼친 상태(`rounded-sm`)에 맞췄다.
         */
        className={cn(
          'flex h-10 w-[52px] items-center justify-center rounded-sm',
          active && 'bg-interaction-active',
        )}
      >
        <ItemIcon size="md" color={active ? 'primary-normal' : color} />
      </button>
    );
  });
}

interface ISidebarBodyProps {
  items: SidebarItemType[];
  value?: string;
  onSelect: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: SidebarVariantType;
}

function SidebarBody({
  items,
  value,
  onSelect,
  open,
  onOpenChange,
  variant,
}: ISidebarBodyProps) {
  /** 브랜드 색 배경 위에서는 메뉴 글자가 흰색이다. */
  const menuColor = variant === 'primary' ? 'static-white' : 'label-normal';

  /**
   * 메뉴는 **전부** 아코디언이다. 하위 항목이 없으면 Accordion이 알아서 쉐브론을
   * 숨기고 헤더 클릭을 선택으로 처리하므로, 평평한 항목을 따로 분기하지 않는다.
   * 목록 전체가 Accordion 하나라서 "동시에 하나만 열린다"는 규칙도 자연히 지켜진다.
   */
  const sections = items.map((item) => ({
    value: item.value,
    label: item.label,
    icon: item.icon,
    options:
      item.items?.map((subItem) => ({
        value: subItem.value,
        label: subItem.label,
      })) ?? [],
  }));

  const openSection = items.find((item) =>
    item.items?.some((subItem) => subItem.value === value),
  )?.value;

  return (
    /*
      펼쳐지는 동안 내용이 눌리거나 가운데에서 왼쪽으로 튀지 않도록 폭을 고정한다.
      rail의 overflow-hidden이 깎아내며 보여주므로 전환이 끊기지 않는다.

      접힘의 `items-center`·`gap-3`은 Figma 실측(11857:15882)이다 — 60px 항목이
      64px 콘텐츠 박스 가운데 서야 헤더 토글·푸터 로고와 중심 48px이 맞는다.
      펼침은 `List`가 같은 12px를 직접 준다.
    */
    <div
      className={cn(
        'flex h-full flex-col overflow-y-auto',
        open ? 'w-[220px]' : 'w-full items-center gap-3',
      )}
    >
      {open ? (
        <List
          sections={sections}
          color={menuColor}
          /** Figma `sidebar/component/set`의 gap은 12px다. */
          gap="md"
          activeHeaderBackground
          /** 메뉴 헤더는 전부 아이콘을 가지므로 하위 글자를 거기 맞춘다. */
          indent
          defaultOpenValue={openSection}
          defaultSelectedValue={value}
          onSelect={(_, optionValue) => onSelect(optionValue)}
        />
      ) : (
        <CollapsedMenu
          items={items}
          value={value}
          onSelect={onSelect}
          onOpenChange={onOpenChange}
          color={menuColor}
        />
      )}
    </div>
  );
}

export default SidebarBody;
