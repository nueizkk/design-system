import { ChangeEvent, SyntheticEvent, useRef } from 'react';

import * as Icon from '../../../../icons';
import { Input } from '../..';
import { InputTriggerPropsType } from '../../config';

// 타이핑 대상이 아니라 트리거라 마우스로 포커스가 가는 것도, 키보드로 값이
// 바뀌는 것도 둘 다 막아야 한다 — 서로 다른 이벤트라 하나로 합칠 수는 없다.
const preventDefault = (e: SyntheticEvent) => e.preventDefault();

interface IFileInputProps extends InputTriggerPropsType {
  value: string | null;
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  multiple?: boolean;
  accept?: string;
}

export const FileInput = ({
  value,
  onFileSelect,
  onClear,
  size,
  label,
  placeholder = '파일 업로드',
  error = false,
  errorMessage,
  disabled = false,
  readOnly = false,
  multiple = false,
  accept,
}: IFileInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 같은 파일을 다시 선택해도 onChange가 또 뜨도록 매번 비운다.
    e.target.value = '';
    if (file) onFileSelect(file);
  };

  return (
    <>
      {/* Input이 className을 안 받아서 감싸는 div로 내부 label·input 커서를 겨냥한다.
      label의 cursor-text(default/filled/error)만 pointer로 바꾸고 —
      disabled(not-allowed)/readOnly(default)는 그대로 둔다. input은 항상 label의
      커서를 그대로 상속해서 I-beam이 뜨는 걸 막는다(브라우저 기본 text 커서 차단). */}
      <div className="[&_label.cursor-text]:cursor-pointer [&_input]:cursor-[inherit] [&_input]:caret-transparent">
        <Input
          size={size}
          label={label}
          leftIcon={Icon.Upload}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={() => {}}
          onKeyDown={preventDefault}
          onClick={() => !readOnly && fileInputRef.current?.click()}
          onMouseDown={preventDefault}
          // 타이핑/포커스 개념이 없는 트리거라 값만 있으면 clear가 뜨게 한다.
          clearOnValue
          onClear={onClear}
          readOnly={readOnly}
          disabled={disabled}
          error={error}
          errorMessage={errorMessage}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        disabled={disabled || readOnly}
        onChange={handleFileChange}
        tabIndex={-1}
        data-testid="fileInputHidden"
      />
    </>
  );
};
