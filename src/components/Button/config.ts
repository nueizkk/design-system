import { TokenSemanticColorType } from 'tokens';

import { TailSpinnerColorType } from '../Loading/TailSpinner';

export type ButtonVariantType = 'primary' | 'outline' | 'secondary';
export type SizeType = 'sm' | 'md' | 'lg';

type IconColorType = Record<ButtonVariantType, TokenSemanticColorType>;

export const colorStyle: IconColorType = {
  primary: 'static-white',
  outline: 'primary-normal',
  secondary: 'label-normal',
};

// TailSpinner는 Figma 스펙상 primary/white 2색만 지원 —
// Figma 문서: Primary Button → white, Secondary·Outline Button → primary
export const spinnerColorStyle: Record<ButtonVariantType, TailSpinnerColorType> = {
  primary: 'white',
  outline: 'primary',
  secondary: 'primary',
};
