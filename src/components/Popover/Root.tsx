import React, {
  Children,
  ReactElement,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { PopoverProvider, usePopover } from "./context";
import PopoverPortal, { SideType } from "./Portal";
import PopoverTrigger from "./Trigger";
import useOutsideClick from "./useOutsideClick";
import { cn } from "../utils/cn";

export type AlignType = "start" | "center" | "end";
export type { SideType };

interface IPopoverProps {
  children: React.ReactNode;
  align?: AlignType;
  side?: SideType;
  openOnHover?: boolean;
  disabled?: boolean;
  /**
   * 트리거가 부모 폭을 꽉 채우게 한다. 기본값은 내용만큼만 넓어지는 `w-fit`이다.
   *
   * 표 셀처럼 "칸을 채우고 넘치면 말줄임"해야 하는 트리거에 필요하다 — `w-fit`이면
   * 글자가 줄지 않아 말줄임이 동작하지 않는다. `min-w-0`까지 같이 풀어줘야 flex
   * 자식이 내용보다 작아질 수 있다.
   */
  fullWidth?: boolean;
}

/** 트리거 조상 중 실제로 스크롤 가능한 요소들을 찾는다(overflow가 auto/scroll/overlay). */
function getScrollParents(el: HTMLElement | null): HTMLElement[] {
  const parents: HTMLElement[] = [];
  let node = el?.parentElement ?? null;

  while (node && node !== document.body) {
    const style = getComputedStyle(node);
    if (/(auto|scroll|overlay)/.test(style.overflow + style.overflowY + style.overflowX)) {
      parents.push(node);
    }
    node = node.parentElement;
  }

  return parents;
}

/** 트리거/패널 둘 다 열림 상태가 바뀔 때마다 실측 좌표를 다시 잰다. */
function useTrackedRect(ref: RefObject<HTMLElement | null>, isActive: boolean) {
  const [rect, setRect] = useState<DOMRect>();

  useLayoutEffect(() => {
    if (!ref.current) return;
    setRect(ref.current.getBoundingClientRect());
  }, [isActive]);

  /**
   * 열려있는 동안 윈도우 리사이즈·페이지 스크롤, 혹은 트리거가 다른 스크롤 컨테이너
   * 안에 있다면 그 컨테이너의 스크롤로 위치가 바뀌면 다시 잰다.
   *
   * useEffect가 아니라 useLayoutEffect여야 한다 — 자동 스크롤 보정
   * useLayoutEffect(아래)가 이 리스너보다 나중에 실행되면서 그 안에서
   * window.scrollBy를 호출하는데, 리스너 등록이 useEffect(페인트 이후로
   * 지연)라면 그 scrollBy가 만든 네이티브 scroll 이벤트가 리스너 등록 전에
   * 지나가버려 우리가 만든 스크롤을 스스로 놓친다. 그러면 triggerRect가
   * 스크롤 이전 값에 영구히 고정돼, 패널이 트리거를 따라가지 못하고
   * 화면 밖으로 나가도 자동 닫힘 체크조차 못 하는 상태가 된다.
   */
  useLayoutEffect(() => {
    if (!isActive) return;

    const handleReposition = () => {
      if (!ref.current) return;
      const next = ref.current.getBoundingClientRect();
      // getBoundingClientRect는 값이 같아도 매번 새 객체라, position: fixed 헤더처럼
      // 스크롤해도 안 움직이는 요소까지 매번 리렌더되는 걸 막기 위해 값을 비교한다.
      setRect((prev) =>
        prev &&
        prev.top === next.top &&
        prev.left === next.left &&
        prev.width === next.width &&
        prev.height === next.height
          ? prev
          : next,
      );
    };

    const scrollParents = getScrollParents(ref.current);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, { passive: true });
    scrollParents.forEach((parent) =>
      parent.addEventListener("scroll", handleReposition, { passive: true }),
    );

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition);
      scrollParents.forEach((parent) =>
        parent.removeEventListener("scroll", handleReposition),
      );
    };
  }, [isActive, ref]);

  return rect;
}

function PopoverRoot({
  children,
  align = "start",
  side = "bottom",
  openOnHover = false,
  disabled = false,
  fullWidth = false,
}: IPopoverProps) {
  return (
    <PopoverProvider disabled={disabled} openOnHover={openOnHover}>
      <PopoverInner
        openOnHover={openOnHover}
        align={align}
        side={side}
        fullWidth={fullWidth}
      >
        {children}
      </PopoverInner>
    </PopoverProvider>
  );
}

function PopoverInner({
  children,
  align,
  side,
  openOnHover,
  fullWidth,
}: Required<Omit<IPopoverProps, "disabled">>) {
  const childrenRef = useRef<HTMLDivElement>(null);

  useOutsideClick();

  const { isActive, ref, open, close } = usePopover();

  const triggerRect = useTrackedRect(ref, isActive);
  // 패널 DOM은 triggerRect가 잡힌 다음 렌더에야 마운트된다. isActive만 기준으로
  // 측정하면 아직 childrenRef가 없을 때 한 번 헛돌고, 그 뒤로는 isActive가 안
  // 바뀌니 다시는 재측정을 안 해서 childrenRect가 0으로 굳어버린다.
  const childrenRect = useTrackedRect(childrenRef, isActive && !!triggerRect);

  let triggerChildren: ReactElement | null = null;
  const otherChildren: React.ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === PopoverTrigger) {
      triggerChildren = child;
    } else {
      otherChildren.push(child);
    }
  });

  useEffect(() => {
    return () => {
      close();
    };
  }, []);

  /**
   * 패널이 열려 실측 높이(childrenRect)를 알게 되면, 화면 밖으로 넘치는 만큼
   * 페인트 전에 미리 스크롤해서 넘치지 않게 만든다. 패널 높이를 추정치로 넘겨받던
   * 방식(autoScrollOffset) 대신 실측값을 쓴다 — 페이지 콘텐츠가 짧아 스크롤 여유가
   * 없는 경우를 위해 side="bottom"일 때만 paddingBottom으로 임시 여유를 만든다.
   *
   * 닫아도 triggerRect/childrenRect는 undefined로 리셋되지 않고 직전 값이 남아있다.
   * 재오픈 첫 렌더는 아직 이번 open의 실측이 아니라 그 옛 값(객체 참조만 다시
   * 세팅된 것)이라, wasActive로 "이미 열려있던 상태에서의 변화"일 때만 계산해
   * 재오픈 첫 렌더를 건너뛴다.
   *
   * 그리고 이 보정은 "열릴 때 미리 한 번" 자리를 만들어주는 목적이지, 열려있는
   * 내내 계속 감시할 대상이 아니다. hasApplied 없이 매 스크롤마다(scroll 리스너가
   * triggerRect를 갱신할 때마다) 다시 계산하면, 패널이 뷰포트보다 커서 스크롤을
   * 아무리 해도 overflow가 0 밑으로 안 내려가는 경우 매 스크롤 이벤트마다
   * scrollBy가 또 호출돼 사용자가 직접 하는 스크롤과 충돌한다(스크롤이 안 먹히는
   * 것처럼 보임). 그래서 open당 딱 한 번만 판단하고 그 뒤로는 스크롤에 관여하지
   * 않는다.
   */
  /**
   * hover로 열었을 때 트리거와 패널 사이의 빈 틈(4px)을 지나가는 동안 깜빡 닫히지
   * 않도록, 둘 다 벗어났을 때만 다음 프레임에 닫는다. 패널은 body로 포탈되므로
   * 트리거의 mouseleave만 보면 패널로 향하는 이동도 이탈로 읽힌다.
   */
  const hoverRef = useRef({ overTrigger: false, overPanel: false, raf: 0 });

  const setHover = (key: "overTrigger" | "overPanel", isOver: boolean) => {
    if (!openOnHover) return;

    cancelAnimationFrame(hoverRef.current.raf);
    hoverRef.current[key] = isOver;

    if (isOver) {
      open();
      return;
    }

    hoverRef.current.raf = requestAnimationFrame(() => {
      const { overTrigger, overPanel } = hoverRef.current;
      if (!overTrigger && !overPanel) close();
    });
  };

  const autoScrollSessionRef = useRef({ wasActive: false, hasApplied: false });
  useLayoutEffect(() => {
    const session = autoScrollSessionRef.current;
    const wasActive = session.wasActive;
    session.wasActive = isActive;

    if (!isActive) {
      session.hasApplied = false;
      return;
    }
    if (!wasActive || session.hasApplied) return;
    if (!triggerRect || !childrenRect) return;
    if (childrenRect.width === 0 && childrenRect.height === 0) return;

    session.hasApplied = true;

    const overflow =
      side === "top"
        ? childrenRect.height - triggerRect.top
        : triggerRect.bottom + childrenRect.height - window.innerHeight;

    if (overflow <= 0) return;

    /**
     * 이 보정 스크롤 자체가 트리거를 화면 밖으로 밀어내면 안 된다 — 트리거가
     * 뷰포트를 벗어나면 아래 "뷰포트 밖으로 나가면 닫는다" 이펙트가 곧바로
     * 패널을 닫아버려서, 방금 연 패널이 스크롤과 동시에 꺼지는 것처럼 보인다.
     * 트리거를 최소 MIN_TRIGGER_VISIBLE만큼은 화면에 남기는 선까지만 스크롤하고,
     * 그래도 못 채우는 나머지 넘침은 패널 자체의 max-height(아래 참고)가 흡수한다.
     */
    const MIN_TRIGGER_VISIBLE = 8;
    const maxSafeOverflow =
      (side === "top" ? window.innerHeight - triggerRect.top : triggerRect.bottom) -
      MIN_TRIGGER_VISIBLE -
      16;
    const cappedOverflow = Math.min(overflow, Math.max(maxSafeOverflow, 0));

    if (cappedOverflow <= 0) return;

    const scrollAmount =
      side === "top" ? -(cappedOverflow + 16) : cappedOverflow + 16;

    if (side === "bottom") {
      document.body.style.paddingBottom = `${scrollAmount}px`;
    }
    window.scrollBy({ top: scrollAmount, behavior: "instant" });
    document.body.dataset.autoScrollAmount = String(scrollAmount);
  }, [isActive, triggerRect, childrenRect, side]);

  /**
   * 다른 스크롤 컨테이너 스크롤로 트리거가 뷰포트 밖으로 완전히 나가면 닫는다.
   * 트리거 없이 패널만 엉뚱한 위치에 떠있는 상태를 막는다.
   *
   * 막 열린(isActive가 false→true로 바뀐) 바로 그 렌더에서는 triggerRect가 아직
   * 이번 open의 실측값이 아니라 직전(닫히기 직전)의 값을 들고 있을 수 있다 —
   * 실측 useLayoutEffect가 새로 값을 반영하기 전에 이 이펙트가 먼저 옛 값으로
   * 평가돼 즉시 다시 닫아버리는 레이스가 생긴다. wasActiveRef로 "이미 열려있던
   * 상태에서의 변화"일 때만 검사해 이 첫 렌더를 건너뛴다.
   */

  const wasActiveRef = useRef(false);
  useEffect(() => {
    const wasActive = wasActiveRef.current;
    wasActiveRef.current = isActive;

    if (!isActive || !triggerRect || !wasActive) return;
    // 아직 실측 전이거나(0,0,0,0) 실제로 크기가 0인 요소는 판단 대상에서 제외한다.
    if (triggerRect.width === 0 && triggerRect.height === 0) return;

    const isOutOfViewport =
      triggerRect.bottom <= 0 ||
      triggerRect.top >= window.innerHeight ||
      triggerRect.right <= 0 ||
      triggerRect.left >= window.innerWidth;

    if (isOutOfViewport) close();
  }, [isActive, triggerRect, close]);

  return (
    <div className={fullWidth ? "w-full min-w-0" : "w-fit"}>
      <div
        className={cn("relative", fullWidth && "min-w-0")}
        onMouseEnter={() => setHover("overTrigger", true)}
        onMouseLeave={() => setHover("overTrigger", false)}
      >
        {triggerChildren}
        {isActive && triggerRect && (
          <PopoverPortal
            childrenRect={childrenRect}
            rect={triggerRect}
            align={align}
            side={side}
          >
            <div
              ref={childrenRef}
              onMouseEnter={() => setHover("overPanel", true)}
              onMouseLeave={() => setHover("overPanel", false)}
              /** 트리거와의 4px 간격만 책임진다. 표면(배경·그림자·라운드)은 패널 몫이다. */
              className={cn("absolute top-0 z-10", side === "top" ? "pb-1" : "pt-1")}
              id="popoverContainer"
            >
              {otherChildren}
            </div>
          </PopoverPortal>
        )}
      </div>
    </div>
  );
}

export default PopoverRoot;
