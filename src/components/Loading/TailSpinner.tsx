import { cva } from "class-variance-authority";

import { iconSize } from "../../icons";

export type TailSpinnerColorType = "primary" | "white";
export type TailSpinnerSizeType = "md" | "lg";

interface ITailSpinnerProps {
  color: TailSpinnerColorType;
  size: TailSpinnerSizeType;
}

export const TailSpinner = ({ color, size }: ITailSpinnerProps) => {
  return (
    <svg
      width={iconSize[size]}
      height={iconSize[size]}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21.1816C16.9706 21.1816 21 17.1522 21 12.1816C21 7.21108 16.9706 3.18164 12 3.18164C7.02944 3.18164 3 7.21108 3 12.1816"
        strokeWidth="2"
        className={PathVariants({ strokeColor: color })}
      >
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};

const PathVariants = cva("", {
  variants: {
    strokeColor: {
      primary: "stroke-primary-normal",
      white: "stroke-static-white",
    },
  },
});
