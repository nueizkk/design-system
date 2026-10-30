import { isSameValues, toValidValues } from '../config';
import { type SelectChipsItemType } from '../../../../SelectChips';

const ITEMS: SelectChipsItemType[] = [
  { label: '로그인', value: 'login' },
  { label: '입금', value: 'deposit' },
  { label: '출금', value: 'withdrawal' },
];

describe('toValidValues', () => {
  it('items에 없는 값을 걸러낸다', () => {
    expect(toValidValues(ITEMS, ['login', '존재하지_않음'])).toEqual(['login']);
  });

  it('전부 없는 값이면 빈 배열을 준다', () => {
    expect(toValidValues(ITEMS, ['없음1', '없음2'])).toEqual([]);
  });

  it('전부 있는 값이면 순서를 유지한 채 그대로 둔다', () => {
    expect(toValidValues(ITEMS, ['withdrawal', 'login'])).toEqual([
      'withdrawal',
      'login',
    ]);
  });

  it('빈 목록은 빈 배열을 준다', () => {
    expect(toValidValues(ITEMS, [])).toEqual([]);
  });
});

describe('isSameValues', () => {
  it('순서가 달라도 같은 묶음이면 true다', () => {
    expect(isSameValues(['a', 'b'], ['b', 'a'])).toBe(true);
  });

  it('개수나 내용이 다르면 false다', () => {
    expect(isSameValues(['a'], ['a', 'b'])).toBe(false);
    expect(isSameValues(['a'], ['b'])).toBe(false);
  });
});
