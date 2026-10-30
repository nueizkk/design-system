import { ReactNode } from 'react';

import { Button } from '../Button';
import { IPaginationProps, Pagination } from '../Pagination';
import { Status } from '../Status';
import { cn } from '../utils/cn';
import { DataCell } from './Cell/DataCell';
import { TitleCell } from './Cell/TitleCell';
import { TableLoading } from './Loading';
import { DataRow } from './Row/Data';
import { NoDataRow } from './Row/NoData';
import { TitleRow } from './Row/Title';
import { ColumnType, TableSizeType, TableSortType } from './types';
import { CELL_WIDTH } from './width';

interface ITableProps<T> {
  columns: ColumnType<T>[];
  data?: T[];
  /**
   * 행을 식별하는 값. `(row) => row.ticketUuid`처럼 넘긴다.
   *
   * **필수다.** 인덱스로 떨어지게 두면 정렬·필터로 순서가 바뀔 때 React가 같은
   * 자리로 알고 DOM을 재사용해, 열려 있던 툴팁이 엉뚱한 행에 남는다. 식별자가
   * 없는 표라면 두 필드를 합쳐 만든다(`\`${row.date}-${row.symbol}\``).
   */
  rowKey: (row: T) => string;
  /**
   * `lg`는 좌우 40px 여백에 행 높이 56, `sm`은 여백 없이 40이다. 헤더의 구분 방식도
   * 함께 바뀐다(`lg` 배경 / `sm` 밑줄). 빈 상태와 로딩 높이도 여기서 나온다.
   */
  size?: TableSizeType;
  /**
   * 행을 눌렀을 때. **넘기지 않으면 hover 음영도 커서도 없다.**
   */
  onRowClick?: (row: T) => void;
  /**
   * 정렬 상태와 바꾸는 법. 실제 정렬은 밖에서 한다 — 보통 URL 쿼리나 서버가 쥔다.
   * 라이브러리는 아이콘을 그리고 다음 상태를 계산해 알리기만 한다.
   */
  sort?: TableSortType;
  isLoading?: boolean;
  /**
   * 표 아래 페이지 이동. **안 넘기면 안 그린다.**
   *
   * 자루로 받는 이유는 표와 페이지네이션이 **한 데이터를 본다는 사실**을 타입이
   * 말하게 하려는 것이다. 전에는 둘이 남남이라 서로 다른 쿼리를 봐도 알 수 없었다.
   *
   * **첫 로딩에는 그리지 않고, 그 뒤로는 그대로 남는다.** 한 번 총 건수를 받으면
   * 기억하므로 페이지를 넘기는 동안 표만 스켈레톤이 되고 숫자 줄은 멈춰 있다 —
   * 표 아래가 들썩이지 않는다.
   */
  pagination?: IPaginationProps;
  /**
   * 이 필드로 행을 묶고, 묶음 사이에 굵은 구분선을 넣는다(옛 주소 / 현재 주소).
   * 값이 바뀌는 지점이 경계다 — 정렬은 하지 않으므로 **이미 묶여서 와야 한다.**
   *
   * Figma에는 없는 축이다. 생김새(10px `line-neutral`)는 옛 코드 그대로 가기로
   * 확정했다(2026-10-14).
   */
  groupBy?: Extract<keyof T, string>;
}

/**
 * 표(Figma `Title`·`Data`·`NoData` 행 3종을 쌓는다).
 *
 * 컬럼 하나가 **헤더와 데이터를 함께** 정한다 — `type`(폭)과 `align`을 한 번만
 * 적으므로 둘이 어긋날 수 없다. 셀을 어떻게 그릴지는 `type`이 정하고, 글자 칸은
 * `cell`로 가공만 하면 폭·말줄임·툴팁·복사가 따라온다.
 *
 * ```tsx
 * <Table
 *   columns={[
 *     { key: 'name', type: 'longText', header: '이름' },
 *     { key: 'amount', type: 'middleText', header: '수량', align: 'right',
 *       currency: (row) => row.symbol, tooltip: 'always', sort: true },
 *     { key: 'status', type: 'status', header: '상태',
 *       status: (row) => ({ type: 'ongoing', label: row.status }) },
 *   ]}
 *   data={rows}
 *   sort={{ ...sortState, onChange: setSortState }}
 *   onRowClick={(row) => push(`/detail/${row.id}`)}
 * />
 * ```
 */
/**
 * 제네릭에 `Record<string, unknown>` 제약을 걸지 않는다. 그 제약을 걸면 `interface`로
 * 선언한 타입이 통과하지 못한다 — TS가 `interface`에는 암묵적 인덱스 시그니처를
 * 주지 않기 때문이다(`type`은 준다). 컬럼 key 검사는 `keyof T`가 하므로 제약 없이도
 * 그대로 산다.
 */
export function Table<T>({
  columns,
  data,
  rowKey,
  size = 'lg',
  onRowClick,
  sort,
  isLoading,
  pagination,
  groupBy,
}: ITableProps<T>) {
  /** `asc → desc → 해제` 순으로 돈다. 해제하면 정렬 기준이 사라진다. */
  const toggleSort = (key: string) => {
    if (!sort) return;
    if (sort.key !== key) return sort.onChange({ key, direction: 'asc' });
    if (sort.direction === 'asc')
      return sort.onChange({ key, direction: 'desc' });
    sort.onChange(undefined);
  };

  /** 다음 행과 `groupBy` 값이 다르면 그 사이를 굵게 가른다. 마지막 행은 제외다. */
  const hasGroupDivider = (index: number) => {
    if (!groupBy || !data) return false;
    if (index === data.length - 1) return false;
    return data[index][groupBy as keyof T] !== data[index + 1][groupBy as keyof T];
  };

  return (
    <div className="w-full">
      <TitleRow size={size}>
        {columns.map((column) => (
          <div key={column.key} className={CELL_WIDTH[column.type]}>
            {/** `0`도 제목일 수 있으므로 falsy가 아니라 "없음"만 걸러낸다. */}
            {column.header != null && column.header !== '' && (
              <TitleCell
                align={column.align}
                sort={
                  column.sort && sort
                    ? {
                        direction:
                          sort.key === column.key ? sort.direction : undefined,
                        onToggle: () => toggleSort(column.key),
                      }
                    : undefined
                }
              >
                {column.header}
              </TitleCell>
            )}
          </div>
        ))}
      </TitleRow>

      {isLoading ? (
        <TableLoading
          columns={columns}
          size={size}
          rowCount={pagination?.pageSize}
        />
      ) : !data?.length ? (
        <NoDataRow size={size} />
      ) : (
        data.map((row, index) => (
          <div
            key={rowKey(row)}
            className={cn(
              hasGroupDivider(index) &&
                'border-line-neutral mb-2.5 border-b-[10px]',
            )}
          >
            <DataRow
              size={size}
              isLast={index === data.length - 1}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <div key={column.key} className={CELL_WIDTH[column.type]}>
                  {renderCell(column, row)}
                </div>
              ))}
            </DataRow>
          </div>
        ))
      )}

      {/**
        * 표와의 간격 20px은 디자이너 확정값이다(2026-10-14). `Pagination`이 자기
        * 패딩(상하 16)을 따로 가지므로 **눈에 보이는 거리는 36px**이 되고, 그게
        * 맞다고 확정됐다(2026-10-15). 가운데 정렬이라 표가 몇 칸이든 숫자 줄이
        * 한가운데 선다.
        */}
      {pagination && (
        <div className="mt-5 flex justify-center">
          <Pagination {...pagination} />
        </div>
      )}
    </div>
  );
}

/** `type`이 무엇을 그릴지 정한다. 글자 칸만 말줄임·툴팁·복사를 갖는다. */
function renderCell<T>(column: ColumnType<T>, row: T) {
  if (column.type === 'status') {
    const { type, label } = column.status(row);
    return <Status type={type} label={label} />;
  }

  if (column.type === 'icon') return column.icon(row);

  if (column.type === 'button') {
    const { label, onClick, disabled } = column.button(row);
    return (
      <Button size="sm" onClick={onClick} disabled={disabled}>
        {label}
      </Button>
    );
  }

  /** 제약을 걸지 않으므로 읽는 자리에서만 단언한다. `key`는 `keyof T`로 이미 좁혀져 있다. */
  const value = row[column.key as keyof T];

  return (
    <DataCell
      align={column.align}
      category={column.category?.(row)}
      currency={column.currency?.(row)}
      copy={column.copy}
      onCopy={(text) => column.onCopy?.(text, row)}
      tooltip={column.tooltip}
    >
      {column.cell
        ? column.cell(value as T[Extract<keyof T, string>], row)
        : (value as ReactNode)}
    </DataCell>
  );
}

export default Table;
