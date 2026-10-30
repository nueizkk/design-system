import { type ComponentPropsWithoutRef } from 'react';

import { TokenSemanticColorType } from 'tokens';

import type { Input } from '.';

// Figma Input(6409:19152)은 sm/md/lg 3사이즈만 정의.
export type InputSizeType = 'sm' | 'md' | 'lg';
export type StatusType =
  | 'default'
  | 'error'
  | 'focus'
  | 'disabled'
  | 'readOnly'
  | 'filled';

type InputColorStyleType = Record<StatusType, TokenSemanticColorType>;

export const inputColorStyle: InputColorStyleType = {
  default: 'label-assistive',
  error: 'status-main-negative',
  disabled: 'label-disable',
  focus: 'label-normal',
  readOnly: 'label-alternative',
  filled: 'label-normal',
};

/**
 * `Input`을 트리거로 쓰는 컴포넌트(`DateInput`·`FileInput`)가 그대로 넘기는
 * 표면. 직접 나열하지 않고 `Input`에서 파생시켜, prop이 늘거나 타입이 바뀌어도
 * 따라 고칠 곳이 생기지 않게 한다.
 *
 * 타이핑을 막는 트리거라 네이티브 input 속성을 통째로 열지 않고 `Pick`한다.
 */
export type InputTriggerPropsType = Pick<
  ComponentPropsWithoutRef<typeof Input>,
  | 'size'
  | 'label'
  | 'placeholder'
  | 'error'
  | 'errorMessage'
  | 'disabled'
  | 'readOnly'
>;
