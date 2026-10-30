import type { IOptionProps, OptionSizeType } from '../Option';

/** 패널이 size를 Option에 그대로 넘기므로 Option의 사이즈를 따른다. xs는 안 쓴다. */
export type SelectBoxSizeType = Exclude<OptionSizeType, 'xs'>;

export type SelectBoxOptionType = Pick<
  IOptionProps,
  'value' | 'label' | 'leftIcon' | 'disabled'
>;
