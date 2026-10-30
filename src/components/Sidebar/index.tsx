import { cva } from 'class-variance-authority';

import SidebarBody from './Body';
import { SidebarItemType, SidebarVariantType } from './config';
import SidebarFooter, { ISidebarFooter } from './Footer';
import SidebarHeader from './Header';

import './style.css';

interface ISidebarProps {
  /** 소비앱이 구성해 넘기는 메뉴. 순서대로 그린다. */
  items: SidebarItemType[];
  /** 현재 선택된 항목의 `value`. 하위 항목의 값도 그대로 넘기면 된다. */
  value?: string;
  onSelect: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * 사이드바 표면의 종류. 배경·메뉴 텍스트·로고가 전부 여기서 파생된다.
   *
   * `neutral`은 중립 배경(`background-normal`), `primary`는 브랜드 색 배경
   * (`primary-heavy`)이다. `'client'`·`'admin'` 같은 서비스 어휘를 디자인
   * 시스템이 알 이유가 없어 외형으로만 가른다.
   */
  variant?: SidebarVariantType;
  /**
   * 하단 회사 정보. **넘기지 않으면 푸터 자체가 렌더되지 않는다** — 이름 없이
   * 로고만 띄우는 상태가 생기지 않도록 한 묶음으로 받는다.
   */
  footer?: ISidebarFooter;
}

export const Sidebar = ({
  items,
  value,
  onSelect,
  open,
  onOpenChange,
  variant = 'neutral',
  footer,
}: ISidebarProps) => (
  <div className={sidebarVariants({ open, variant })}>
    <div className="flex h-screen w-full flex-col items-center justify-between gap-10">
      <div className="flex max-h-[calc(100vh-56px)] h-full w-full flex-col gap-8">
        <SidebarHeader
          variant={variant}
          open={open}
          onToggle={() => onOpenChange(!open)}
        />
        <SidebarBody
          items={items}
          value={value}
          onSelect={onSelect}
          open={open}
          onOpenChange={onOpenChange}
          variant={variant}
        />
      </div>
      {footer && <SidebarFooter {...footer} open={open} />}
    </div>
  </div>
);

const sidebarVariants = cva(
  /**
   * `sticky`라 흐름에 남는다 — 폭만큼 본문을 밀어내고, 스크롤하면 상단에 붙는다.
   * 전에는 `fixed`라 흐름 밖에 있어서, 헤더가 사이드바 폭을 직접 빼야 했다.
   *
   * `shrink-0`이 없으면 본문이 길 때 flex가 사이드바를 줄여버린다.
   */
  'sticky top-0 shrink-0 flex flex-col justify-between items-center pt-7 pb-8 h-screen select-none overflow-hidden transition-[width] duration-300 z-sidebar',
  {
    variants: {
      variant: {
        neutral: 'bg-background-normal',
        primary: 'bg-primary-heavy',
      },
      open: {
        /** Figma 심볼 실측: open=True 260px(px-5), open=False 96px(px-4) */
        true: 'w-[260px] px-5',
        false: 'w-[96px] px-4',
      },
    },
  },
);
