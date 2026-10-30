import { SyntheticEvent } from 'react';

import dayjs from 'dayjs';

import { DATE_FORMAT } from '../../../utils/date';

import * as Icon from '../../../../icons';
import { Calendar } from '../../../Calendar';
import { Input } from '../..';
import { InputTriggerPropsType } from '../../config';
import { Popover } from '../../../Popover';
import { usePopover } from '../../../Popover/context';
import { useStrings } from '../../../../i18n';

const preventDefault = (e: SyntheticEvent) => e.preventDefault();

interface IDateInputProps extends InputTriggerPropsType {
  value: string | null;
  onChange: (value: string | null) => void;
  minDate?: string;
  maxDate?: string;
}

export const DateInput = ({
  value,
  onChange,
  size,
  label,
  placeholder,
  error = false,
  errorMessage,
  disabled = false,
  readOnly = false,
  minDate,
  maxDate,
}: IDateInputProps) => {
  const strings = useStrings();
  return (
    <Popover align="start" disabled={disabled || readOnly}>
      <Popover.Trigger>
        {/* Input이 className을 안 받아서 감싸는 div로 내부 label·input 커서를 겨냥한다.
        label의 cursor-text(default/filled/error)만 pointer로 바꾸고 —
        disabled(not-allowed)/readOnly(default)는 그대로 둔다. input은 항상 label의
        커서를 그대로 상속해서 I-beam이 뜨는 걸 막는다(브라우저 기본 text 커서 차단). */}
        <div className="[&_label.cursor-text]:cursor-pointer [&_input]:cursor-[inherit] [&_input]:caret-transparent">
          <Input
            size={size}
            label={label}
            leftIcon={Icon.Calendar}
            placeholder={placeholder ?? strings['year_month_date']}
            value={value ? dayjs(value).format(DATE_FORMAT) : ''}
            onChange={() => {}}
            onKeyDown={preventDefault}
            onMouseDown={preventDefault}
            // 타이핑/포커스 개념이 없는 트리거라 값만 있으면 clear가 뜨게 한다.
            clearOnValue
            onClear={() => onChange(null)}
            readOnly={readOnly}
            disabled={disabled}
            error={error}
            errorMessage={errorMessage}
          />
        </div>
      </Popover.Trigger>
      <DateInputCalendar
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        // Calendar는 sm/lg만 있어서 md는 sm으로 내린다.
        calendarSize={size === 'lg' ? 'lg' : 'sm'}
      />
    </Popover>
  );
};

const DateInputCalendar = ({
  value,
  onChange,
  minDate,
  maxDate,
  calendarSize,
}: Pick<IDateInputProps, 'value' | 'onChange' | 'minDate' | 'maxDate'> & {
  calendarSize: 'sm' | 'lg';
}) => {
  const { close } = usePopover();

  return (
    <Calendar
      isRange={false}
      size={calendarSize}
      minDate={minDate}
      maxDate={maxDate}
      startDate={value}
      setStartDate={(date) => {
        onChange(date);
        close();
      }}
    />
  );
};
