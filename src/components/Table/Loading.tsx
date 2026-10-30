import { Skeleton } from '../Skeleton';
import { ColumnType, TableSizeType } from './types';
import { CELL_WIDTH } from './width';

/**
 * 데이터를 기다리는 동안 행 자리를 지킨다(`Table`의 `isLoading`).
 *
 * **Figma에 Skeleton 디자인이 없다.** 임의 수치를 만들지 않으려고 이미 확정된
 * 것에서만 끌어온다 — 칸 폭은 `CELL_WIDTH`, 행 높이·좌우 여백은 `Data` 행,
 * 막대 높이는 `body-2` 줄높이(20), 둥글기는 헤더 행과 같은 `sm`(8). 디자인이
 * 오면 이 파일만 고치면 된다.
 *
 * 컬럼을 그대로 따르므로 로딩이 끝나 데이터가 들어와도 **칸이 움직이지 않는다.**
 * 전에는 고정 6개 막대를 그려서 컬럼이 8개면 로딩과 본문의 폭이 전부 달랐다.
 *
 * 전체 높이는 빈 상태(`NoData`)와 같다. 로딩이 끝나고 결과가 0건일 때도 출렁이지
 * 않는다.
 */
const HEIGHT: Record<TableSizeType, string> = {
  sm: 'h-[240px]',
  lg: 'h-[400px]',
};

/** `Data` 행 실측. */
const ROW_HEIGHT: Record<TableSizeType, string> = { sm: 'h-10', lg: 'h-14' };
const ROW_PADDING: Record<TableSizeType, string> = { sm: '', lg: 'px-10' };

/** `rowCount`를 모를 때만 쓴다. 빈 상태와 같은 높이에 들어갈 만큼이다. */
const FALLBACK_ROW_SIZE: Record<TableSizeType, number> = { sm: 6, lg: 7 };

interface ITableLoadingProps<T> {
  columns: ColumnType<T>[];
  size?: TableSizeType;
  /**
   * 그릴 행 수. 보통 `pagination.pageSize`가 들어온다 — 한 페이지에 담길 행 수가
   * 곧 들어올 데이터의 행 수라, **로딩과 데이터의 높이가 같아진다.**
   *
   * 모르면 빈 상태와 같은 높이(lg 400 · sm 240)를 쓴다.
   */
  rowCount?: number;
}

export function TableLoading<T>({
  columns,
  size = 'lg',
  rowCount,
}: ITableLoadingProps<T>) {
  return (
    <div className={rowCount ? undefined : HEIGHT[size]}>
      {Array.from({ length: rowCount ?? FALLBACK_ROW_SIZE[size] }, (_, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex items-center gap-8 ${ROW_HEIGHT[size]} ${ROW_PADDING[size]}`}
        >
          {columns.map((column) => (
            <div key={column.key} className={CELL_WIDTH[column.type]}>
              {/** 글자 한 줄이 설 자리다 — `body-2` 줄높이와 같은 20px. */}
              <Skeleton rounded="sm" height="20px" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default TableLoading;
