import {
  collapseValues,
  collectLeafValues,
  expandValues,
  getCheckedState,
  isSameValues,
  toValidValues,
  type IStatusOption,
} from '../config';

const OPTIONS: IStatusOption[] = [
  {
    label: '입금',
    value: 'deposit',
    children: [
      { label: '입금 확인중', value: 'depositPending' },
      { label: '입금 완료', value: 'depositComplete' },
    ],
  },
  {
    label: '출금',
    value: 'withdrawal',
    collapsible: true,
    children: [
      {
        label: '어드민 리뷰',
        value: 'withdrawalReview',
        collapsible: true,
        children: [
          { label: '1차', value: 'withdrawalFirst' },
          { label: '2차', value: 'withdrawalSecond' },
        ],
      },
      { label: '출금 완료', value: 'withdrawalComplete' },
    ],
  },
];

describe('collectLeafValues', () => {
  it('중첩 깊이와 무관하게 말단 값만 모은다', () => {
    expect(collectLeafValues(OPTIONS[1])).toEqual([
      'withdrawalFirst',
      'withdrawalSecond',
      'withdrawalComplete',
    ]);
  });
});

describe('getCheckedState', () => {
  it('하위가 전부 선택되면 true, 일부면 partial, 없으면 false다', () => {
    expect(
      getCheckedState(OPTIONS[0], ['depositPending', 'depositComplete']),
    ).toBe(true);
    expect(getCheckedState(OPTIONS[0], ['depositPending'])).toBe('partial');
    expect(getCheckedState(OPTIONS[0], [])).toBe(false);
  });
});

describe('expandValues', () => {
  it('collapsible 묶음 값을 하위 말단 전체로 펼친다', () => {
    expect(expandValues(OPTIONS, ['withdrawalReview'])).toEqual([
      'withdrawalFirst',
      'withdrawalSecond',
    ]);
  });

  it('collapsible이 아닌 상위 값은 펼치지 않는다', () => {
    expect(expandValues(OPTIONS, ['deposit'])).toEqual([]);
  });

  it('말단 값은 그대로 통과시킨다', () => {
    expect(expandValues(OPTIONS, ['depositPending'])).toEqual([
      'depositPending',
    ]);
  });
});

describe('collapseValues', () => {
  it('하위가 전부 선택된 collapsible 노드는 자기 value 하나로 접는다', () => {
    expect(
      collapseValues(OPTIONS, ['withdrawalFirst', 'withdrawalSecond']),
    ).toEqual(['withdrawalReview']);
  });

  it('가장 바깥쪽 묶음을 우선한다', () => {
    expect(
      collapseValues(OPTIONS, [
        'withdrawalFirst',
        'withdrawalSecond',
        'withdrawalComplete',
      ]),
    ).toEqual(['withdrawal']);
  });

  it('일부만 선택되면 접지 않고 말단 값을 그대로 낸다', () => {
    expect(collapseValues(OPTIONS, ['withdrawalFirst'])).toEqual([
      'withdrawalFirst',
    ]);
  });

  it('collapsible이 아닌 노드는 전부 선택돼도 말단 값을 낸다', () => {
    expect(
      collapseValues(OPTIONS, ['depositPending', 'depositComplete']),
    ).toEqual(['depositPending', 'depositComplete']);
  });

  it('expand → collapse 왕복이 원래 값을 보존한다', () => {
    const applied = ['withdrawalReview'];
    expect(collapseValues(OPTIONS, expandValues(OPTIONS, applied))).toEqual(
      applied,
    );
  });
});

describe('toValidValues', () => {
  it('옵션 트리에 없는 값을 걸러낸다', () => {
    expect(toValidValues(OPTIONS, ['depositPending', '존재하지_않음'])).toEqual([
      'depositPending',
    ]);
  });

  it('전부 없는 값이면 빈 배열을 준다', () => {
    expect(toValidValues(OPTIONS, ['없음1', '없음2'])).toEqual([]);
  });

  it('collapsible 묶음 값은 그대로 보존한다', () => {
    expect(toValidValues(OPTIONS, ['withdrawalReview'])).toEqual([
      'withdrawalReview',
    ]);
  });

  it('상위 노드라도 collapsible이 아니면 값으로 인정하지 않는다', () => {
    expect(toValidValues(OPTIONS, ['deposit'])).toEqual([]);
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
