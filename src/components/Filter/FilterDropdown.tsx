import { ReactNode, useEffect, useRef, useState } from 'react';


import { useFilterContext } from './context';
import { usePopover } from '../Popover/context';
import { Scroll } from '../Scroll';
import * as Icon from '../../icons';
import { Text } from '../Text';
import { cn } from '../utils/cn';
import { useStrings } from '../../i18n';

/** Filter.Dropdown이 공개 Filter의 일부라 타입은 이름을 가질 수 있어야 한다(DTS) */
export interface IFilterDropdownProps {
  children: ReactNode;
  /** 초기화 — 패널 안 draft만 비우고 적용값은 건드리지 않는다 */
  onDeselect: () => void;
  onSubmit: () => void;
  disableSubmit?: boolean;
}

/** Filter.Dropdown으로만 쓰인다. 제목은 Filter(root)가 Context로 내려준다. */
export const FilterDropdown = ({
  children,
  onDeselect,
  onSubmit,
  disableSubmit = false,
}: IFilterDropdownProps) => {
  const strings = useStrings();
  const { title } = useFilterContext();

  const { toggle, close } = usePopover();

  const [hasScroll, setHasScroll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      setHasScroll(scrollHeight > clientHeight);
    }
  }, [containerRef.current]);

  return (
    <div
      className={cn(
        'shadow-300 bg-background-elevated rounded-sm flex max-h-[500px] w-[420px] flex-col gap-4 overflow-hidden py-5',
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between px-9">
          <Text variant="subtitle-2" weight="bold" color="label-normal">
            {title}
          </Text>
          <Icon.XMark onClick={toggle} cursor="pointer" />
        </div>
        <Scroll maxHeight={367}>
          <div
            ref={containerRef}
            className={cn(
              'relative flex flex-col gap-3 px-9',
              hasScroll && 'pr-4',
            )}
          >
            {children}
          </div>
        </Scroll>
      </div>
      <div className="flex flex-col items-end gap-2.5 px-9">
        {/** 구분선은 Figma에 컴포넌트가 없다. 레포의 다른 구분선들처럼 직접 그린다. */}
        <div className="bg-line-normal min-h-[1px] w-full" />
        <div className="flex items-center gap-3 px-1">
          <Text
            variant="body-2"
            color="label-neutral"
            onClick={onDeselect}
            className="cursor-pointer"
          >
            {strings['clear']}
          </Text>
          <Text
            variant="body-2"
            color={disableSubmit ? 'label-disable' : 'label-strong'}
            onClick={
              disableSubmit
                ? undefined
                : () => {
                    onSubmit();
                    close();
                  }
            }
            className={disableSubmit ? 'cursor-not-allowed' : 'cursor-pointer'}
          >
            {strings['apply']}
          </Text>
        </div>
      </div>
    </div>
  );
};
