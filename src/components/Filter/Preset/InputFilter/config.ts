import { type ComponentPropsWithoutRef } from 'react';

import { Input } from '../../../Input';

/**
 * Input이 받는 prop을 그대로 열어둔다 — label/placeholder/unit/error처럼
 * 인풋마다 다를 수 있는 값을 여기서 다시 나열하지 않기 위해서다.
 * size는 필터 안에서 'sm'으로 고정이고, name/value/onChange는 아래처럼
 * 의미를 좁히거나 바꿔서 다시 받는다.
 */
export interface IFilterInputItem
  extends Omit<
    ComponentPropsWithoutRef<typeof Input>,
    'size' | 'name' | 'value' | 'onChange'
  > {
  /** 인풋을 구분하는 식별자 — React key와 폼 필드 name으로 함께 쓰인다 */
  name: string;
  /** 적용된(쿼리 파라미터 등) 값 */
  value: string;
  /**
   * 타이핑할 때가 아니라 "완료"를 눌렀을 때, 그 인풋의 draft 값으로 호출된다.
   * 타이핑 중인 값은 필터 내부 draft가 들고 있다.
   */
  onChange: (value: string) => void;
}

/** 하나라도 입력돼 있으면 필터가 걸린 것으로 본다 */
export const hasAnyValue = (inputs: IFilterInputItem[]) =>
  inputs.some(({ value }) => value !== '');

/** draft는 name을 키로 들고 있어 인풋 순서가 바뀌어도 값이 엉키지 않는다 */
export const getDraftValues = (
  inputs: IFilterInputItem[],
  getValue: (input: IFilterInputItem) => string,
) => Object.fromEntries(inputs.map((input) => [input.name, getValue(input)]));
