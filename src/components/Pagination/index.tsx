import { cva } from 'class-variance-authority';

import { getPageIconColor } from './config';
import usePagination from './hooks/usePagination';
import * as Icon from '../../icons';

export interface IPaginationProps {
  /** 현재 페이지(1부터). 주소창 값이 그대로 올 수 있어 범위 밖·숫자 아님도 견딘다. */
  page: number;
  /**
   * 전체 **건수**. 페이지 수가 아니다.
   *
   * 아직 모르면 `undefined`다 — `totalItems={data?.totalItemCount}`처럼 그대로
   * 넘긴다.
   *
   * `null`은 받지 않는다. API 응답은 늘 `number`이고, "아직 모름"을 두 가지로
   * 표현할 이유가 없다.
   */
  totalItems: number | undefined;
  /**
   * 한 페이지에 담는 건수. **기본값을 두지 않는다** — 서버가 잘라 주는 단위와
   * 같아야 하고, 어긋나면 전체 페이지 수가 틀어져 없는 페이지로 가는 숫자가 생긴다.
   * 조용히 틀리느니 늘 적게 한다.
   */
  pageSize: number;
  onPageChange: (page: number) => void;
}

/**
 * 페이지 이동(Figma `Pagination` 11186:7738).
 *
 * **표 아래에 놓을 때는 직접 쓰지 않는다** — `Table`의 `pagination` 자루에 넘기면
 * 간격·0건 처리가 따라오고, 표와 한 데이터를 본다는 사실이 타입에 남는다.
 * 따로 쓰면 표가 2페이지를 그리는데 숫자는 1페이지를 말해도 아무도 못 막는다.
 *
 * 공개로 두는 것은 **표가 아닌 목록** 때문이다 — 카드 목록이나 대시보드 위젯처럼
 * 표 없이 페이지를 넘기는 자리가 있다.
 *
 * 숫자는 **10개 묶음**으로만 보여준다 — 지금 페이지가 속한 묶음만 그리고, 마지막
 * 묶음은 남은 개수만 선다(총 13페이지 → `11 12 13`).
 *
 * - `‹` `›` 1페이지 이전·다음
 * - `«` `»` **이전·다음 묶음의 첫 페이지**로
 *
 * 크기 축이 없다. Figma `Pagination/Item`의 variant가 `active` 하나뿐이다.
 */
export const Pagination = ({
  page,
  totalItems,
  pageSize,
  onPageChange,
}: IPaginationProps) => {
  const {
    isEmpty,
    page: currentPage,
    pages,
    disabledPrev,
    disabledNext,
    disabledPrevGroup,
    disabledNextGroup,
    goToPage,
    goPrev,
    goNext,
    goPrevGroup,
    goNextGroup,
    getCursor,
  } = usePagination({ page, totalItems, pageSize, onPageChange });

  /**
   * 0건이거나 한 페이지뿐이면 그리지 않는다. **한 번도 총 건수를 받은 적이 없을
   * 때도** 마찬가지다 — 그 판단은 훅이 한다(직전 값을 기억하므로 `totalItems`가
   * 잠시 `null`이 되는 것만으로는 사라지지 않는다).
   */
  if (isEmpty) return null;

  return (
    /**
     * 상하 16 · 좌우 32는 **컴포넌트가 가진 패딩**이다(Figma `11186:9400`,
     * 504×58에서 내부 요소를 뺀 값). 놓는 쪽이 주는 간격은 이 위에 더해진다 —
     * 표 아래에 놓으면 `mt-5`(20)와 합쳐 36px이 되는 것이 맞다.
     */
    <div className="flex items-center gap-8 px-8 py-4">
      <div className="flex items-center gap-2">
        <Icon.ChevronsLeft
          size="sm"
          cursor={getCursor(disabledPrevGroup)}
          color={getPageIconColor(!disabledPrevGroup)}
          onClick={goPrevGroup}
          data-testid="doubleLeft"
        />
        <Icon.ChevronLeft
          size="sm"
          cursor={getCursor(disabledPrev)}
          color={getPageIconColor(!disabledPrev)}
          onClick={goPrev}
          data-testid="left"
        />
      </div>

      <div className="flex items-center gap-1.5">
        {pages.map((number) => (
          <a
            className={PageVariants({
              active: currentPage === number ? 'active' : 'inactive',
            })}
            key={number}
            onClick={() => goToPage(number)}
          >
            {number}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Icon.ChevronRight
          size="sm"
          cursor={getCursor(disabledNext)}
          color={getPageIconColor(!disabledNext)}
          onClick={goNext}
          data-testid="right"
        />
        <Icon.ChevronsRight
          size="sm"
          cursor={getCursor(disabledNextGroup)}
          color={getPageIconColor(!disabledNextGroup)}
          onClick={goNextGroup}
          data-testid="doubleRight"
        />
      </div>
    </div>
  );
};

/**
 * 숫자 칸(Figma `Pagination/Item` 36751:356). variant는 `active` 하나뿐이다.
 *
 * `py-1 px-2` + `caption-1`(줄높이 18) = 높이 26. 실측과 같다.
 */
const PageVariants = cva(
  'typo-caption-1 rounded-xs flex cursor-pointer items-center justify-center px-2 py-1',
  {
    variants: {
      active: {
        active: 'font-bold text-primary-normal bg-interaction-active',
        inactive: 'bg-transparent text-label-normal',
      },
    },
    defaultVariants: { active: 'inactive' },
  },
);
