import { useState } from 'react';

import { act, screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { FileInput } from '..';

const FileInputHarness = ({
  initialValue = null,
  ...props
}: Partial<React.ComponentProps<typeof FileInput>> & {
  initialValue?: string | null;
}) => {
  const [value, setValue] = useState<string | null>(initialValue);
  return (
    <FileInput
      size="md"
      value={value}
      onFileSelect={(file) => setValue(file.name)}
      onClear={() => setValue(null)}
      {...props}
    />
  );
};

describe('FileInput', () => {
  it('값이 없으면 placeholder를 보여준다.', () => {
    useRender({ component: <FileInputHarness /> });
    expect(screen.getByPlaceholderText('파일 업로드')).toHaveValue('');
  });

  it('값이 있으면 파일명을 보여주고 clear 버튼이 노출된다.', () => {
    useRender({ component: <FileInputHarness initialValue="photo.png" /> });
    expect(screen.getByDisplayValue('photo.png')).toBeInTheDocument();
    expect(screen.getByTestId('inputClearIcon')).toBeInTheDocument();
  });

  it('값이 없으면 clear 버튼이 없다.', () => {
    useRender({ component: <FileInputHarness /> });
    expect(screen.queryByTestId('inputClearIcon')).not.toBeInTheDocument();
  });

  it('트리거를 누르면 숨겨진 파일 입력이 클릭된다.', async () => {
    const { user } = useRender({ component: <FileInputHarness /> });

    const hiddenInput = screen.getByTestId<HTMLInputElement>('fileInputHidden');
    const clickSpy = jest.spyOn(hiddenInput, 'click');

    await act(async () => {
      await user.click(screen.getByPlaceholderText('파일 업로드'));
    });

    expect(clickSpy).toHaveBeenCalled();
  });

  it('파일을 선택하면 onFileSelect가 호출되고 파일명이 표시된다.', async () => {
    const { user } = useRender({ component: <FileInputHarness /> });

    const hiddenInput = screen.getByTestId<HTMLInputElement>('fileInputHidden');
    const file = new File(['content'], 'regulation_v2.pdf', {
      type: 'application/pdf',
    });

    await act(async () => {
      await user.upload(hiddenInput, file);
    });

    expect(screen.getByDisplayValue('regulation_v2.pdf')).toBeInTheDocument();
    expect(screen.getByTestId('inputClearIcon')).toBeInTheDocument();
  });

  it('clear 버튼을 누르면 값이 비워지고 placeholder로 돌아간다.', async () => {
    const { user } = useRender({
      component: <FileInputHarness initialValue="photo.png" />,
    });

    await act(async () => {
      await user.click(screen.getByTestId('inputClearIcon'));
    });

    expect(screen.getByPlaceholderText('파일 업로드')).toHaveValue('');
    expect(screen.queryByTestId('inputClearIcon')).not.toBeInTheDocument();
  });

  it('키보드로 값을 바꾸려 해도 반영되지 않는다.', async () => {
    const { user } = useRender({
      component: <FileInputHarness initialValue="photo.png" />,
    });

    const input = screen.getByDisplayValue('photo.png');
    await act(async () => {
      await user.type(input, 'hacked.exe');
    });

    expect(screen.getByDisplayValue('photo.png')).toBeInTheDocument();
  });

  it('disabled면 눌러도 파일 선택창이 안 열리고 clear 버튼도 없다.', async () => {
    useRender({
      component: <FileInputHarness initialValue="photo.png" disabled />,
    });

    expect(screen.queryByTestId('inputClearIcon')).not.toBeInTheDocument();
    expect(screen.getByTestId<HTMLInputElement>('fileInputHidden')).toBeDisabled();
  });

  it('readOnly면 파일명은 톤다운돼 보이고 clear 버튼도 없고 선택창도 안 열린다.', async () => {
    const { user } = useRender({
      component: <FileInputHarness initialValue="photo.png" readOnly />,
    });

    expect(screen.queryByTestId('inputClearIcon')).not.toBeInTheDocument();

    const hiddenInput = screen.getByTestId<HTMLInputElement>('fileInputHidden');
    const clickSpy = jest.spyOn(hiddenInput, 'click');

    await act(async () => {
      await user.click(screen.getByDisplayValue('photo.png'));
    });

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('error면 feedback text가 노출된다.', () => {
    useRender({
      component: (
        <FileInputHarness
          initialValue="photo.png"
          error
          errorMessage="feedback text"
        />
      ),
    });

    expect(screen.getByText('feedback text')).toBeInTheDocument();
  });

  it('label을 넘기면 라벨 텍스트가 보인다.', () => {
    useRender({ component: <FileInputHarness label="첨부파일" /> });
    expect(screen.getByText('첨부파일')).toBeInTheDocument();
  });

  it('필드를 클릭해 포커스가 가도 clear 버튼은 그대로 하나만 유지된다.', async () => {
    const { user } = useRender({
      component: <FileInputHarness initialValue="photo.png" />,
    });

    await act(async () => {
      await user.click(screen.getByDisplayValue('photo.png'));
    });

    expect(screen.getAllByTestId('inputClearIcon')).toHaveLength(1);
  });
});
