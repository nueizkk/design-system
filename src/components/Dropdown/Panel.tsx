import { Option } from '../Option';
import { usePopover } from '../Popover/context';
import { DropdownOptionType } from './config';

interface IDropdownPanelProps {
  options: DropdownOptionType[][];
}

export function DropdownPanel({ options }: IDropdownPanelProps) {
  const { toggle } = usePopover();

  return (
    /** 패널 표면은 패널이 그린다 — Popover는 위치만 잡는다. */
    <div className="shadow-300 bg-background-elevated rounded-sm max-h-[calc(100vh-16px)] w-fit min-w-[160px] max-w-[288px] overflow-y-auto p-1">
      <div className="flex w-full flex-col">
        {options.map((group, groupIndex) => (
          <div key={groupIndex}>
            {groupIndex > 0 && <hr className="border-line-normal my-0.5" />}
            <div className="flex w-full flex-col gap-0.5">
              {group.map((option) => (
                <Option
                  key={option.value}
                  size="xs"
                  value={option.value}
                  label={option.label}
                  leftIcon={option.leftIcon}
                  rightIcon={option.rightIcon}
                  negative={option.negative}
                  disabled={option.disabled}
                  onClick={() => {
                    toggle();
                    option.onClick();
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
