import { useRef, useState } from 'react';

/**
 * 패널 안의 draft를 조작하는 동작. Filter.Dropdown의 footer(초기화/완료)는
 * draft를 들고 있는 Fields 컴포넌트의 형제라 직접 참조할 수 없어서, Fields가
 * 이 두 함수를 ref에 꽂아두면 footer가 꺼내 쓴다.
 */
export interface IDraftActions {
  reset: () => void;
  apply: () => void;
}

/**
 * 프리셋(부모) 쪽에서 쓴다. actionsRef와 완료 버튼의 disable 상태를 만들고,
 * Filter.Dropdown에 그대로 펼쳐 넣을 props를 돌려준다.
 *
 * 초기화는 언제나 누를 수 있으므로 따로 disable 상태를 두지 않는다.
 */
export const useFilterDraft = (initialDisableSubmit = false) => {
  const actionsRef = useRef<IDraftActions>({
    reset: () => {},
    apply: () => {},
  });
  const [disableSubmit, setDisableSubmit] = useState(initialDisableSubmit);

  return {
    actionsRef,
    setDisableSubmit,
    dropdownProps: {
      onDeselect: () => actionsRef.current.reset(),
      onSubmit: () => actionsRef.current.apply(),
      disableSubmit,
    },
  };
};
