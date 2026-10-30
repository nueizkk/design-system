import { IconComponentType } from '../../icons';

export interface DropdownOptionType {
  value: string;
  label: string;
  onClick: () => void;
  leftIcon?: IconComponentType;
  rightIcon?: IconComponentType;
  negative?: boolean;
  disabled?: boolean;
}
