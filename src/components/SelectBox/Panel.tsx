import { UIEvent, useEffect, useRef, useState } from 'react';

import { BarSpinner } from '../Loading/BarSpinner';
import { Option } from '../Option';
import { usePopover } from '../Popover/context';
import { Scroll } from '../Scroll';
import { cn } from '../utils/cn';
import { SelectBoxOptionType, SelectBoxSizeType } from './types';

const ROW_HEIGHT: Record<SelectBoxSizeType, number> = { sm: 40, md: 48, lg: 56 };
const VISIBLE_ROWS = 5;
/** 옵션 사이 간격. 아래 리스트의 `gap-0.5`와 같아야 한다 — 어긋나면 마지막 줄이 잘린다. */
const ROW_GAP = 2;
// 스크롤이 끝에 거의 닿았다고 볼 오차 허용치(px)
const SCROLL_END_THRESHOLD = 4;
// 로딩 바 높이(BarSpinner 행). 로딩 중엔 이만큼을 스크롤 영역에서 빼서 패널 전체 높이를 고정한다.
const LOADING_BAR_HEIGHT = 40;

// 로딩 바가 나타날 때만 페이드인한다. loading이 꺼지면 실제 로딩이 끝난 시점 그대로 바로
// 사라져야 해서(수명을 늘리면 실제보다 더 오래 도는 것처럼 보임) 사라질 때는 애니메이션을 넣지 않는다.
function LoadingBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={cn(
        'bg-background-overlay flex h-10 shrink-0 items-center justify-center rounded-b-sm transition-opacity duration-150',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <BarSpinner />
    </div>
  );
}

interface ISelectBoxPanelProps {
  size: SelectBoxSizeType;
  options: SelectBoxOptionType[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  loading?: boolean;
  onScrollEnd?: () => void;
  minWidth: number;
}

export function SelectBoxPanel({
  size,
  options,
  selectedValue,
  onSelect,
  loading = false,
  onScrollEnd,
  minWidth,
}: ISelectBoxPanelProps) {
  const { toggle } = usePopover();
  /**
   * 5줄이 스크롤 없이 들어가야 한다. **사이 간격까지 더해야** 다섯째 줄이 안 잘린다
   * — Figma md 패널의 리스트가 248px이고 이는 `5*48 + 4*2`다(`4444:6007`).
   */
  const maxHeight =
    ROW_HEIGHT[size] * VISIBLE_ROWS + ROW_GAP * (VISIBLE_ROWS - 1);
  const scrollMaxHeight = loading ? maxHeight - LOADING_BAR_HEIGHT : maxHeight;
  const scrollRef = useRef<HTMLDivElement>(null);

  // 재오픈 시 이전에 선택한 옵션이 보이는 위치로 자동 스크롤
  useEffect(() => {
    if (!selectedValue) return;
    scrollRef.current
      ?.querySelector(`[data-value="${selectedValue}"]`)
      ?.scrollIntoView({ block: 'start' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const reachedEnd =
      target.scrollHeight - target.scrollTop - target.clientHeight <
      SCROLL_END_THRESHOLD;
    if (reachedEnd) onScrollEnd?.();
  };

  const list = (
    <div className="flex w-full flex-col gap-0.5">
      {options.map((option) => (
        <Option
          key={option.value}
          value={option.value}
          size={size}
          active={option.value === selectedValue}
          disabled={option.disabled}
          leftIcon={option.leftIcon}
          label={option.label}
          onClick={() => {
            toggle();
            onSelect(option.value);
          }}
        />
      ))}
    </div>
  );

  return (
    <div
      className="bg-background-normal shadow-200 flex flex-col overflow-hidden rounded-sm"
      style={{ minWidth }}
      // 옵션 클릭이 트리거의 blur로 이어지면 안 된다 — 선택은 열림 상태만 닫고,
      // 트리거의 포커스(active 파란 테두리)는 실제 blur 전까지 유지돼야 한다.
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="p-1">
        <Scroll ref={scrollRef} maxHeight={scrollMaxHeight} onScroll={handleScroll}>
          {list}
        </Scroll>
      </div>
      {loading && <LoadingBar />}
    </div>
  );
}
