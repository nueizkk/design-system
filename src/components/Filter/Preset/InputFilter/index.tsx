
import { hasAnyValue, type IFilterInputItem } from './config';
import { InputFilterFields } from './InputFilterFields';
import { Filter } from '../../Root';
import { useFilterDraft } from '../../useFilterDraft';
import { IconComponentType } from '../../../../icons';

interface IInputFilterProps {
  title: string;
  icon: IconComponentType;
  /** 하나면 단일 인풋, 여럿이면 세로로 쌓인다(금액 범위처럼) */
  inputs: IFilterInputItem[];
}

export const InputFilter = ({
  title,
  icon,
  inputs,
}: IInputFilterProps) => {
  const { actionsRef, dropdownProps } = useFilterDraft();

  return (
    <Filter
      active={hasAnyValue(inputs)}
      title={title}
      onRemoveFilter={() => inputs.forEach((input) => input.onChange(''))}
    >
      <Filter.Chip icon={icon} />
      <Filter.Dropdown {...dropdownProps}>
        <InputFilterFields
          inputs={inputs}
          actionsRef={actionsRef}
        />
      </Filter.Dropdown>
    </Filter>
  );
};
