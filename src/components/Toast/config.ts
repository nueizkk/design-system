import { ComponentType } from 'react';

import { TokenSemanticColorType } from 'tokens';

import * as Icon from '../../icons';
import { IconProps } from '../../icons';

export type ToastVariantType = 'success' | 'error';

/**
 * `title`은 한국어 화면에서도 영어로 노출하는 것이 디자인 의도라 i18n 대상이
 * 아니다 — 언어와 무관하게 값이 같아 키로 뺄 이유가 없다.
 */
export const typeStyle: Record<
  ToastVariantType,
  { title: string; Icon: ComponentType<IconProps>; color: TokenSemanticColorType }
> = {
  success: {
    title: 'Success',
    Icon: Icon.CircleCheck,
    color: 'status-main-positive',
  },
  error: {
    title: 'Error',
    Icon: Icon.CircleX,
    color: 'status-main-negative',
  },
};
