import { Chip } from '../Chip';

interface ISelectChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export const SelectChip = ({ label, active, onClick }: ISelectChipProps) => (
  <Chip size="sm" active={active} onClick={onClick}>
    {label}
  </Chip>
);
