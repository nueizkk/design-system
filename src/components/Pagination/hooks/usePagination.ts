import { useEffect, useRef } from 'react';

/**
 * 숫자를 한 번에 보여주는 묶음 크기. Figma가 10으로 못 박았고, 바꾸거나 끄는
 * 속성은 두지 않는다("화살표 4개는 필수, 다른 아이콘으로 바꾸는 속성은 없다").
 */
const PAGE_GROUP_SIZE = 10;

interface IUsePaginationProps {
  page: number;
  totalItems: number | undefined;
  pageSize: number;
  onPageChange: (page: number) => void;
}

/**
 * 주소창에서 그대로 들어오는 값이라 숫자가 아닐 수도(`?page=fdafsd`), 범위 밖일
 * 수도(`?page=0`, `?page=999`) 있다. 그리는 값은 **항상 범위 안으로 접는다** —
 * 접지 않으면 `NaN`이 계산에 번져 숫자 줄이 통째로 비고 화살표 판정도 틀어진다.
 */
const clampPage = (page: number, totalPages: number) => {
  if (!Number.isFinite(page)) return 1;
  return Math.min(Math.max(Math.trunc(page), 1), totalPages);
};

function usePagination({
  page,
  totalItems,
  pageSize,
  onPageChange,
}: IUsePaginationProps) {
  /**
   * 한 번 받은 총 건수를 기억한다. `undefined`가 와도 **직전 값으로 계속 그린다** —
   * 페이지를 넘기는 동안 숫자 줄이 사라졌다 나타나면 표 아래가 들썩인다.
   *
   * suspense 없이 `useQuery`를 쓰면 페이지가 바뀌는 순간 `data`가 `undefined`가
   * 되는데, 그 깜빡임을 여기서 막는다.
   *
   * **처음 올라올 때는 기억할 것이 없어 그대로 사라진다** — 새로 마운트되면 ref가
   * 비어 있으므로, 첫 로딩에는 넘겨도 아무것도 그리지 않는다.
   *
   * `0`은 기억하지 않는다 — "아직 모름"과 달리 **결과가 없다**는 확정이라 그대로
   * 반영해야 한다.
   */
  const lastKnownRef = useRef<number>();
  if (totalItems !== undefined) lastKnownRef.current = totalItems;

  const knownTotal = totalItems ?? lastKnownRef.current;
  const totalPages = knownTotal ? Math.ceil(knownTotal / pageSize) : 0;

  /**
   * 그릴 것이 없는 상태. 0건이거나 **한 페이지뿐일 때**다.
   *
   * 한 페이지뿐이면 숫자가 `1` 하나에 화살표 넷이 전부 꺼져서, 누를 수 있는 것이
   * 하나도 없는 줄이 남는다. 0건을 안 그리는 것과 같은 이유로 그리지 않는다.
   *
   * 0건일 때는 아래 계산과 바깥 알림도 건너뛴다 — `clampPage(1, 0)`이 `0`이 되어
   * 없는 페이지를 알리기 때문이다.
   */
  const isEmpty = totalPages === 0;
  const isSinglePage = totalPages <= 1;

  /**
   * 0건일 때 접으면 `clampPage(1, 0)`이 `0`이 되어 **없는 페이지를 밖에 알린다**.
   * 소비앱이 그 값으로 다시 요청하므로 접기 자체를 건너뛴다.
   */
  const safePage = isEmpty ? 1 : clampPage(page, totalPages);
  const isOutOfRange = !isEmpty && safePage !== page;

  /**
   * 접었다는 사실을 밖에도 알린다. **렌더가 끝난 뒤**에 부른다 — 렌더 중에 부모
   * 상태를 바꾸면 React가 경고하고, 부모가 비동기로 처리하면 매 렌더마다 다시
   * 호출돼 루프가 된다.
   */
  useEffect(() => {
    if (isOutOfRange) onPageChange(safePage);
  }, [isOutOfRange, safePage, onPageChange]);

  /** 지금 페이지가 속한 묶음(1~10 → 1, 11~20 → 2). `page`에서 나오므로 상태로 들지 않는다. */
  const group = Math.ceil(safePage / PAGE_GROUP_SIZE);
  const totalGroups = Math.ceil(totalPages / PAGE_GROUP_SIZE);

  /** 지금 묶음의 번호들. 마지막 묶음은 남은 개수만 선다(총 13페이지 → `11 12 13`). */
  const pages = Array.from(
    { length: Math.min(PAGE_GROUP_SIZE, totalPages - (group - 1) * PAGE_GROUP_SIZE) },
    (_, index) => (group - 1) * PAGE_GROUP_SIZE + index + 1,
  );

  const disabledPrev = safePage === 1;
  const disabledNext = safePage >= totalPages;
  const disabledPrevGroup = group === 1;
  const disabledNextGroup = group >= totalGroups;

  /** 묶음 이동은 **그 묶음의 첫 페이지**로 간다(Figma: 11~13에서 « → 1). */
  const goToGroup = (nextGroup: number) =>
    onPageChange((nextGroup - 1) * PAGE_GROUP_SIZE + 1);

  return {
    /** 0건이거나 한 페이지뿐이면 그리지 않는다. */
    isEmpty: isSinglePage,
    page: safePage,
    pages,
    disabledPrev,
    disabledNext,
    disabledPrevGroup,
    disabledNextGroup,
    goToPage: (next: number) => onPageChange(next),
    goPrev: () => !disabledPrev && onPageChange(safePage - 1),
    goNext: () => !disabledNext && onPageChange(safePage + 1),
    goPrevGroup: () => !disabledPrevGroup && goToGroup(group - 1),
    goNextGroup: () => !disabledNextGroup && goToGroup(group + 1),
    getCursor: (disabled: boolean) => (disabled ? 'not-allowed' : 'pointer'),
  };
}

export default usePagination;
