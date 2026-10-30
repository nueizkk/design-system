import { ReactNode } from 'react';

import { createPortal } from 'react-dom';

import { AlignType } from './Root';

export type SideType = 'top' | 'bottom';

interface IPopoverPortalProps {
  rect: DOMRect;
  children: ReactNode;
  align: AlignType;
  side: SideType;
  childrenRect?: DOMRect;
}
const PopoverPortal = ({
  children,
  align,
  side,
  rect,
  childrenRect,
}: IPopoverPortalProps) => {
  const getStyle = () => {
    if (!childrenRect) return;

    /**
     * 트리거-패널 4px 간격은 여기서 더하지 않는다 — 패널 컨테이너 자체의
     * pt-1/pb-1(4px)이 그 역할을 한다(Main.tsx의 패널 className, side에 따라 다름).
     */
    const top =
      side === 'top' ? rect.top - childrenRect.height : rect.top + rect.height;
    const left: Record<AlignType, number> = {
      start: rect.left,
      /** 트리거 중앙에 패널 중앙을 맞춘다. 툴팁처럼 꼬리가 중앙에 있는 패널용이다. */
      center: rect.left + rect.width / 2 - childrenRect.width / 2,
      end: rect.left - childrenRect.width + rect.width,
    };

    return { top, left: left[align] };
  };

  return createPortal(
    <div className="fixed z-popover" style={getStyle()}>
      {children}
    </div>,
    document.body,
  );
};

export default PopoverPortal;
