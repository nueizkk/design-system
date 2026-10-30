import {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';

interface IPopoverState {
  isActive: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  ref: MutableRefObject<HTMLDivElement | null>;
  disabled: boolean;
  /** hover로 여는 모드. 트리거가 클릭 토글을 하지 않도록 Trigger가 읽는다. */
  openOnHover: boolean;
  /**
   * useOutsideClick이 같은 Popover 인스턴스 내에서 여러 번 호출돼도
   * window 클릭 리스너가 중복 등록되지 않도록 막는 락.
   */
  outsideClickLockRef: MutableRefObject<boolean>;
}

const PopoverContext = createContext<IPopoverState | undefined>(undefined);

export const PopoverProvider = ({
  children,
  disabled,
  openOnHover,
}: {
  disabled: boolean;
  openOnHover: boolean;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const outsideClickLockRef = useRef(false);
  const [isActive, setActive] = useState(false);

  /**
   * stale closure 방지: isActive의 최신 값을 동기적으로 참조하기 위해 ref로 추적한다.
   * PopoverInner의 cleanup useEffect는 의존성 배열이 []이므로 마운트 시점의 close를 캡처한다.
   * 해당 클로저에서 isActive를 직접 읽으면 항상 초기값(false)을 참조하므로, ref를 통해 최신 값을 읽는다.
   */
  const isActiveRef = useRef(false);
  isActiveRef.current = isActive;

  const open = () => {
    if (disabled) return;
    setActive(true);
  };

  const close = () => {
    if (disabled) return;
    if (isActiveRef.current) {
      /**
       * 열릴 때 Main.tsx가 화면 밖 넘침을 막으려고 추가한 paddingBottom과
       * 스크롤 위치를 원래대로 복원한다.
       */
      const scrollAmount = parseInt(
        document.body.dataset.autoScrollAmount ?? '0',
        10,
      );
      if (scrollAmount !== 0) {
        document.body.style.paddingBottom = '';
        window.scrollBy({ top: -scrollAmount, behavior: 'instant' });
        delete document.body.dataset.autoScrollAmount;
      }
    }
    setActive(false);
  };

  const toggle = () => {
    if (disabled) return;
    if (!isActiveRef.current) {
      open();
    } else {
      close();
    }
  };

  return (
    <PopoverContext.Provider
      value={{
        ref,
        isActive,
        openOnHover,
        toggle,
        open,
        close,
        disabled,
        outsideClickLockRef,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
};

export const usePopover = () => {
  const context = useContext(PopoverContext);
  if (context === undefined) throw new Error('Popover 하위에서만 사용할 수 있습니다.');
  return context;
};
