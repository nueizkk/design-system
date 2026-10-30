import { useEffect, useState, type MutableRefObject } from 'react';

import dayjs from 'dayjs';

import {
  EMPTY_RANGE,
  getMatchedPreset,
  getPresetRange,
  getSubmitDisabled,
  type IDateRange,
} from './config';
import { Calendar } from '../../../Calendar';
import { Input } from '../../../Input';
import { SelectChips } from '../../../SelectChips';
import * as Icon from '../../../../icons';
import { Text } from '../../../Text';
import { type IDraftActions } from '../../useFilterDraft';
import { DATE_FORMAT } from '../../../utils/date';
import { useStrings } from '../../../../i18n';

interface IDateFilterFieldsProps {
  value: IDateRange;
  onApply: (value: IDateRange) => void;
  actionsRef: MutableRefObject<IDraftActions>;
  onDisableSubmitChange: (disableSubmit: boolean) => void;
}

/**
 * Filter.Dropdown의 children이라 패널이 닫히면(Popover가 조건부 렌더)
 * 통째로 언마운트되고, 다시 열릴 때 draft가 그 시점의 value로 새로
 * 초기화된다 — 완료/초기화 없이 닫아도 다음에 열면 항상 적용된 값에서
 * 다시 시작한다.
 */
export const DateFilterFields = ({
  value,
  onApply,
  actionsRef,
  onDisableSubmitChange,
}: IDateFilterFieldsProps) => {
  const strings = useStrings();
  const [draft, setDraft] = useState(value);

  const toDisplay = (date: string | null) =>
    date ? dayjs(date).format(DATE_FORMAT) : '';

  const presetItems = [
    { value: 'week', label: strings['last_week'] },
    { value: 'month', label: strings['last_month'] },
    { value: 'year', label: strings['last_year'] },
    { value: 'direct', label: strings['direct'] },
  ];

  actionsRef.current = {
    reset: () => setDraft(EMPTY_RANGE),
    apply: () => onApply(draft),
  };

  const disableSubmit = getSubmitDisabled(draft);

  useEffect(() => {
    onDisableSubmitChange(disableSubmit);
  }, [disableSubmit, onDisableSubmitChange]);

  return (
    <>
      <SelectChips
        type="single"
        value={getMatchedPreset(draft)}
        items={presetItems}
        onSelect={(preset) => setDraft(getPresetRange(preset))}
      />
      <Calendar
        startDate={draft.startDate}
        endDate={draft.endDate}
        setStartDate={(startDate) =>
          setDraft((prev) => ({ ...prev, startDate }))
        }
        setEndDate={(endDate) => setDraft((prev) => ({ ...prev, endDate }))}
      />
      <div className="border-line-normal bg-background-normal flex gap-8 rounded-sm border px-4 py-6">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between">
            <Text variant="caption-1" weight="light" color="label-alternative">
              {strings['calendar_start']}
            </Text>
            <Icon.ArrowRefresh
              size="sm"
              color="label-alternative"
              cursor="pointer"
              onClick={() => setDraft((prev) => ({ ...prev, startDate: null }))}
            />
          </div>
          <Input
            size="sm"
            value={toDisplay(draft.startDate)}
            placeholder={strings['year_month_date']}
            readOnly
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between">
            <Text variant="caption-1" weight="light" color="label-alternative">
              {strings['calendar_end']}
            </Text>
            <Icon.ArrowRefresh
              size="sm"
              color="label-alternative"
              cursor="pointer"
              onClick={() => setDraft((prev) => ({ ...prev, endDate: null }))}
            />
          </div>
          <Input
            size="sm"
            value={toDisplay(draft.endDate)}
            placeholder={strings['year_month_date']}
            readOnly
          />
        </div>
      </div>
    </>
  );
};
