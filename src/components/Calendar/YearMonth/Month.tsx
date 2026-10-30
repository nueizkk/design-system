import YearMonthCell from './YearMonthCell';
import { MonthNumberType, SizeType } from '../config';
import { cn } from '../../utils/cn';

// 월 그리드 전용 — 헤더의 "월 연도"는 MONTH_NAME(전체 이름)를 그대로 쓰지만,
// 그리드 버튼은 Figma대로 3글자 축약형(Jan, Feb...)을 쓴다.
const MONTH_NAME_ABBR: Record<MonthNumberType, string> = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

const MONTH_LIST = Object.values(MONTH_NAME_ABBR).map((label, idx) => ({
  value: idx + 1,
  label,
}));

interface IMonthProps {
  onClick: (value: number) => void;
  selected?: number;
  size: SizeType;
}

const Month = ({ onClick, selected, size }: IMonthProps) => {
  const isSelected = (value: number) => value === selected;

  return (
    <div
      className={cn(
        'grid flex-1 grid-cols-3 gap-x-2',
        size === 'lg' ? 'gap-y-8' : 'gap-y-6',
      )}
    >
      {MONTH_LIST.map((item) => (
        <YearMonthCell
          key={item.value}
          size={size}
          active={isSelected(item.value)}
          label={item.label}
          onClick={() => onClick(item.value)}
        />
      ))}
    </div>
  );
};

export default Month;
