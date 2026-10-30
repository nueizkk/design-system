import { useEffect, useRef } from 'react';

import YearMonthCell from './YearMonthCell';
import { SizeType } from '../config';
import { Scroll } from '../../Scroll';

const FIRST_YEAR = 1900;
const LAST_YEAR = 2100;

interface IYearProps {
  onClick: (value: number) => void;
  selected?: number;
  size: SizeType;
}

const Year = ({ onClick, selected, size }: IYearProps) => {
  const isSelected = (value: number) => value === selected;
  const activeRef = useRef<HTMLDivElement>(null);

  const yearList = Array.from(
    { length: LAST_YEAR - FIRST_YEAR + 1 },
    (_, idx) => {
      const year = idx + FIRST_YEAR;
      return { value: year, name: String(year) };
    },
  );

  /** 선택된 연도가 바뀔 때마다(열릴 때 포함) 스크롤을 가운데로 맞춘다. */
  useEffect(() => {
    activeRef.current?.scrollIntoView?.({ block: 'center' });
  }, [selected]);

  return (
    <Scroll
      containerClassName={size === 'lg' ? 'h-[368px] w-[128px]' : 'h-[272px] w-[96px]'}
      maxHeight={size === 'lg' ? 368 : 272}
      className="flex flex-col gap-2 pr-4"
    >
      {yearList.map((item) => (
        <YearMonthCell
          key={item.value}
          ref={isSelected(item.value) ? activeRef : undefined}
          size={size}
          active={isSelected(item.value)}
          label={item.name}
          onClick={() => onClick(item.value)}
        />
      ))}
    </Scroll>
  );
};

export default Year;
