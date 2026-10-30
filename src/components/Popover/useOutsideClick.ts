import { useEffect } from 'react';

import { usePopover } from './context';

const useOutsideClick = () => {
  const { ref, isActive, toggle, outsideClickLockRef } = usePopover();

  useEffect(() => {
    /** 같은 Popover 인스턴스에서 이 훅이 여러 번 호출돼도 리스너는 한 번만 등록한다. */
    if (!isActive || outsideClickLockRef.current) return;
    outsideClickLockRef.current = true;

    const pageClickEvent = (e: Event) => {
      const hasParentWithPopoverContainerId =
        (e.target as Element).closest('#popoverContainer') !== null;

      if (
        ref.current !== null &&
        !ref.current.contains(e.target as Node) &&
        !hasParentWithPopoverContainerId
      ) {
        toggle();
      }
    };

    window.addEventListener('click', pageClickEvent, { capture: true });

    return () => {
      window.removeEventListener('click', pageClickEvent, { capture: true });
      outsideClickLockRef.current = false;
    };
  }, [isActive, ref, toggle, outsideClickLockRef]);

  return [isActive, toggle];
};

export default useOutsideClick;
