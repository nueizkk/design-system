import { cva } from "class-variance-authority";

export type TabItemType = {
  label: string;
  onClick: () => void;
  active: boolean;
};

export const Tab = ({ label, active, onClick }: TabItemType) => {
  return (
    <div className={tabVariants({ active })} onClick={onClick}>
      {label}
    </div>
  );
};

const tabVariants = cva(
  "max-w-[150px] truncate text-center px-2.5 pb-2.5 cursor-pointer typo-body-2 border-label-normal text-label-normal",
  {
    variants: {
      active: {
        true: "border-b-2 font-bold",
        false: "font-light",
      },
    },
  },
);
