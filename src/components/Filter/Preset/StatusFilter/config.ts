import { StatusType } from '../../../Status';

/**
 * 깊이 제한 없이 중첩할 수 있는 상태 옵션 트리.
 * 기본적으로 실제 필터 값이 되는 건 children이 없는 말단 노드의 value뿐이고,
 * children이 있는 노드의 value는 식별자(key) 역할만 한다.
 */
export interface IStatusOption {
  label: string;
  /** 지정하면 label을 Status 뱃지로, 없으면 일반 텍스트로 렌더링한다 */
  type?: StatusType;
  value: string;
  children?: IStatusOption[];
  /**
   * 하위가 전부 선택되면 children 값들 대신 이 노드의 value 하나로 내보낸다
   * ("전체"를 뜻하는 묶음 값을 받는 API용). 반대로 value에 이 값이 들어오면
   * 하위 전체 선택으로 펼쳐서 표시한다.
   */
  collapsible?: boolean;
}

/** children이 없는 말단 노드의 value만 모은다 */
export const collectLeafValues = (option: IStatusOption): string[] =>
  option.children?.length
    ? option.children.flatMap(collectLeafValues)
    : [option.value];

/** 말단 노드는 자기 자신, 상위 노드는 하위 말단들의 선택 개수로 결정된다 */
export const getCheckedState = (
  option: IStatusOption,
  checkedValues: string[],
): boolean | 'partial' => {
  const leaves = collectLeafValues(option);
  const checkedCount = leaves.filter((v) => checkedValues.includes(v)).length;

  if (checkedCount === 0) return false;
  if (checkedCount === leaves.length) return true;
  return 'partial';
};

/**
 * 바깥에서 들어온 값을 내부에서 다루는 말단 값 목록으로 펼친다.
 * collapsible 노드의 묶음 값이 들어와 있으면 그 하위 말단 전체로 바꾼다.
 */
export const expandValues = (
  options: IStatusOption[],
  values: string[],
): string[] =>
  Array.from(
    new Set(
      options.flatMap((option) => {
        if (option.collapsible && values.includes(option.value)) {
          return collectLeafValues(option);
        }
        if (option.children?.length) {
          return expandValues(option.children, values);
        }
        return values.includes(option.value) ? [option.value] : [];
      }),
    ),
  );

/**
 * 내부 말단 값 목록을 바깥으로 내보낼 형태로 접는다.
 * 하위가 전부 선택된 collapsible 노드는 자기 value 하나로 대체하며,
 * 위에서부터 훑어 가장 바깥쪽 묶음을 우선한다.
 */
export const collapseValues = (
  options: IStatusOption[],
  leafValues: string[],
): string[] =>
  options.flatMap((option) => {
    const checkedState = getCheckedState(option, leafValues);

    if (checkedState === false) return [];
    if (option.collapsible && checkedState === true) return [option.value];
    if (!option.children?.length) return [option.value];
    return collapseValues(option.children, leafValues);
  });

/**
 * 옵션 트리에 실제로 존재하는 값만 남긴 정규 형태.
 * expandValues가 트리를 순회하며 매칭되는 값만 돌려주므로, 그 결과를 다시
 * collapseValues로 접어 들어온 것과 같은 표현으로 되돌린다.
 */
export const toValidValues = (options: IStatusOption[], values: string[]) =>
  collapseValues(options, expandValues(options, values));

/** 순서와 무관하게 같은 값 묶음인지 본다 */
export const isSameValues = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value) => b.includes(value));
