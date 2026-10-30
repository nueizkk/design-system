import { act, screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Input } from '..';
import * as Icon from '../../../icons';

describe('기본 동작', () => {
  it('label과 placeholder를 렌더링한다.', async () => {
    await useRender({
      component: <Input size="md" label="이름" placeholder="입력하세요" />,
    });

    expect(screen.getByText('이름')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('입력하세요')).toBeInTheDocument();
  });

  it('error가 아니면 errorMessage가 있어도 렌더링하지 않는다.', async () => {
    await useRender({
      component: <Input size="md" errorMessage="필수 항목입니다" />,
    });

    expect(screen.queryByText('필수 항목입니다')).not.toBeInTheDocument();
  });

  it('error면 errorMessage를 렌더링한다.', async () => {
    await useRender({
      component: <Input size="md" error errorMessage="필수 항목입니다" />,
    });

    expect(screen.getByText('필수 항목입니다')).toBeInTheDocument();
  });

  it('leftIcon을 렌더링한다.', async () => {
    await useRender({ component: <Input size="md" leftIcon={Icon.Search} /> });

    expect(document.querySelector('svg')).toBeInTheDocument();
  });
});

describe('clear 버튼', () => {
  it('포커스+값이 있을 때만 노출된다.', async () => {
    const { user } = await useRender({
      component: <Input size="md" placeholder="입력하세요" />,
    });

    expect(screen.queryByTestId('inputClearIcon')).not.toBeInTheDocument();

    const input = screen.getByPlaceholderText('입력하세요');
    await act(async () => {
      await user.click(input);
      await user.type(input, 'hello');
    });

    expect(screen.getByTestId('inputClearIcon')).toBeInTheDocument();
  });

  it('클릭하면 값이 비워지고 onChange가 호출된다.', async () => {
    const onChange = jest.fn();
    const { user } = await useRender({
      component: (
        <Input size="md" placeholder="입력하세요" onChange={onChange} />
      ),
    });

    const input = screen.getByPlaceholderText<HTMLInputElement>('입력하세요');
    await act(async () => {
      await user.click(input);
      await user.type(input, 'hello');
    });

    onChange.mockClear();

    await act(async () => {
      await user.click(screen.getByTestId('inputClearIcon'));
    });

    expect(input.value).toBe('');
    expect(onChange).toHaveBeenCalled();
  });

  it('disabled면 값이 있어도 노출되지 않는다.', async () => {
    await useRender({
      component: <Input size="md" defaultValue="hello" disabled />,
    });

    expect(screen.queryByTestId('inputClearIcon')).not.toBeInTheDocument();
  });

  it('password 타입도 입력중이면 눈 아이콘과 함께 노출된다.', async () => {
    const { user } = await useRender({
      component: <Input size="md" type="password" placeholder="비밀번호" />,
    });

    const input = screen.getByPlaceholderText('비밀번호');
    await act(async () => {
      await user.click(input);
      await user.type(input, 'secret123');
    });

    expect(screen.getByTestId('inputClearIcon')).toBeInTheDocument();
    expect(screen.getByTestId('inputRightIcon')).toBeInTheDocument();
  });

  it('unit보다 앞에 위치한다.', async () => {
    const { user } = await useRender({
      component: <Input size="md" placeholder="수량" unit="ETH" />,
    });

    const input = screen.getByPlaceholderText('수량');
    await act(async () => {
      await user.click(input);
      await user.type(input, '1.2');
    });

    const clear = screen.getByTestId('inputClearIcon');
    const unit = screen.getByText('ETH');
    expect(
      clear.compareDocumentPosition(unit) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('rightIcon이 있어도 사라지지 않고 함께 노출된다.', async () => {
    const { user } = await useRender({
      component: <Input size="md" placeholder="날짜" rightIcon={Icon.Calendar} />,
    });

    const input = screen.getByPlaceholderText('날짜');
    await act(async () => {
      await user.click(input);
      await user.type(input, '2026-09-07');
    });

    expect(screen.getByTestId('inputClearIcon')).toBeInTheDocument();
    expect(screen.getByTestId('inputRightIcon')).toBeInTheDocument();
  });
});
