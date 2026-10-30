import { IconBase, type IconProps } from './base';

/** Figma가 글리프만 정의한다 — 원형 배경 없음. 색도 고정이라 `color`를 따르지 않는다. */
export const Eng = (props: IconProps) => (
  <IconBase {...props}>
    <path
      d="M5 16.1067V7.89333H10.88V9.66666H7.24V11.0667H10.6V12.9333H7.24V14.3333H10.88V16.1067H5Z"
      fill="#FFAA33"
    />
    <path
      d="M19 7.89333V16.0133H17.1334L14.1467 11.72H14.0534V16.0133H12V7.89333H13.8667L16.76 12.1867H16.8534V7.89333H19Z"
      fill="#FFAA33"
    />
  </IconBase>
);
