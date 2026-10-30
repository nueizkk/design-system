/**
 * Figma(34422:20437)의 interaction 축. `filled`(blur 후 값이 있는 상태)는
 * default와 테두리·배경이 같아 코드에서 구분할 이유가 없어 두지 않는다.
 */
export type TextareaStatusType =
  | 'default'
  | 'error'
  | 'focus'
  | 'disabled'
  | 'readOnly';
