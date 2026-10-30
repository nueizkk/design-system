import { MouseEvent } from 'react';

import { usePopover } from './context';
import { cn } from '../utils/cn';

export interface IPopoverTriggerProps {
  children:
    | ((value: { isActive: boolean }) => React.ReactNode)
    | React.ReactNode;
}

function PopoverTrigger({ children }: IPopoverTriggerProps) {
  const { ref, toggle, isActive, disabled, openOnHover } = usePopover();

  const handleClickTrigger = (e: MouseEvent) => {
    /**
     * hover로 여는 모드에서는 클릭에 **전혀 관여하지 않는다.** 여기서 전파를 막으면
     * 트리거를 감싼 바깥의 클릭(표의 행 클릭 같은 것)까지 죽는다 — 툴팁이 칸 전체를
     * 덮는 경우 그 칸만 눌리지 않는 표가 된다.
     */
    if (openOnHover) return;

    // 트리거 안에 label로 감싼 컨트롤(예: DateInput의 Input)이 있으면, label의
    // 패딩·아이콘처럼 실제 컨트롤이 아닌 곳을 클릭했을 때 브라우저가 그 컨트롤에
    // click을 한 번 더 합성해서 쏜다. preventDefault 없이 두면 이 합성 클릭까지
    // 버블링돼 toggle이 두 번 불려 열리자마자 바로 닫혀버린다(자체 상쇄).
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    toggle();
  };

  return (
    <div
      ref={ref}
      onClick={handleClickTrigger}
      className={cn(
        !openOnHover && 'cursor-pointer',
        disabled && 'cursor-not-allowed',
      )}
    >
      {typeof children === 'function'
        ? children({ isActive: !!isActive })
        : children}
    </div>
  );
}

export default PopoverTrigger;
