import { InputHTMLAttributes } from "react";

export const Radio = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    type="radio"
    className="border-line-normal checked:border-primary-normal disabled:border-line-normal disabled:bg-interaction-disable m-0 h-[20px] min-h-[20px] w-[20px] min-w-[20px] cursor-pointer appearance-none rounded-full border-[1.5px] checked:border-[7px]"
    {...props}
  />
);
