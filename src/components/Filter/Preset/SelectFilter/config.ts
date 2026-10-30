import { type SelectChipsItemType } from '../../../SelectChips';

/** items에 실제로 존재하는 값만 남긴다 */
export const toValidValues = (
  items: SelectChipsItemType[],
  values: string[],
) => values.filter((value) => items.some((item) => item.value === value));

/** 순서와 무관하게 같은 값 묶음인지 본다 */
export const isSameValues = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value) => b.includes(value));
