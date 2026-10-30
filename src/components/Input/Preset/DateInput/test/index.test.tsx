import { useState } from 'react';

import { act, screen } from '@testing-library/react';
import { advanceTo, clear } from 'jest-date-mock';
import { useRender } from 'test-util';

import { DateInput } from '..';

const DateInputHarness = ({
  initialValue = null,
  ...props
}: Partial<React.ComponentProps<typeof DateInput>> & {
  initialValue?: string | null;
}) => {
  const [value, setValue] = useState<string | null>(initialValue);
  return <DateInput size="md" value={value} onChange={setValue} {...props} />;
};

afterEach(() => clear());

describe('DateInput', () => {
  it('값이 없으면 placeholder를 보여준다.', () => {
    useRender({ component: <DateInputHarness /> });
    expect(screen.getByPlaceholderText('YYYY-MM-DD')).toHaveValue('');
  });

  it('값이 있으면 날짜를 보여주고 clear 버튼이 노출된다.', () => {
    useRender({ component: <DateInputHarness initialValue="2026-03-05" /> });
    expect(screen.getByDisplayValue('2026-03-05')).toBeInTheDocument();
    expect(screen.getByTestId('inputClearIcon')).toBeInTheDocument();
  });

  it('값이 없으면 clear 버튼이 없다.', () => {
    useRender({ component: <DateInputHarness /> });
    expect(screen.queryByTestId('inputClearIcon')).not.toBeInTheDocument();
  });

  it('트리거를 누르면 캘린더 패널이 열린다.', async () => {
    advanceTo(new Date(2026, 8, 10));
    const { user } = useRender({ component: <DateInputHarness /> });

    expect(screen.queryByText('September 2026')).not.toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByPlaceholderText('YYYY-MM-DD'));
    });

    expect(screen.getByText('September 2026')).toBeInTheDocument();
  });

  it('캘린더에서 날짜를 선택하면 onChange가 호출되고 패널이 닫힌다.', async () => {
    advanceTo(new Date(2026, 8, 10));
    const { user } = useRender({ component: <DateInputHarness /> });

    await act(async () => {
      await user.click(screen.getByPlaceholderText('YYYY-MM-DD'));
    });

    await act(async () => {
      await user.click(screen.getByTestId('2026-09-15'));
    });

    expect(screen.getByDisplayValue('2026-09-15')).toBeInTheDocument();
    expect(screen.queryByText('September 2026')).not.toBeInTheDocument();
  });

  it('clear 버튼을 누르면 값이 비워지고 placeholder로 돌아간다.', async () => {
    const { user } = useRender({
      component: <DateInputHarness initialValue="2026-03-05" />,
    });

    await act(async () => {
      await user.click(screen.getByTestId('inputClearIcon'));
    });

    expect(screen.getByPlaceholderText('YYYY-MM-DD')).toHaveValue('');
    expect(screen.queryByTestId('inputClearIcon')).not.toBeInTheDocument();
  });

  it('clear 버튼을 눌러도 캘린더 패널이 열리지 않는다.', async () => {
    const { user } = useRender({
      component: <DateInputHarness initialValue="2026-03-05" />,
    });

    await act(async () => {
      await user.click(screen.getByTestId('inputClearIcon'));
    });

    expect(screen.queryByText('March 2026')).not.toBeInTheDocument();
  });

  it('키보드로 값을 바꾸려 해도 반영되지 않는다.', async () => {
    const { user } = useRender({
      component: <DateInputHarness initialValue="2026-03-05" />,
    });

    const input = screen.getByDisplayValue('2026-03-05');
    await act(async () => {
      await user.type(input, 'hacked');
    });

    expect(screen.getByDisplayValue('2026-03-05')).toBeInTheDocument();
  });

  it('disabled면 눌러도 캘린더가 안 열리고 clear 버튼도 없다.', async () => {
    const { user } = useRender({
      component: <DateInputHarness initialValue="2026-03-05" disabled />,
    });

    expect(screen.queryByTestId('inputClearIcon')).not.toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByDisplayValue('2026-03-05'));
    });

    expect(screen.queryByText('March 2026')).not.toBeInTheDocument();
  });

  it('readOnly면 값은 톤다운돼 보이고 clear 버튼도 없고 캘린더도 안 열린다.', async () => {
    const { user } = useRender({
      component: <DateInputHarness initialValue="2026-03-05" readOnly />,
    });

    expect(screen.queryByTestId('inputClearIcon')).not.toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByDisplayValue('2026-03-05'));
    });

    expect(screen.queryByText('March 2026')).not.toBeInTheDocument();
  });

  it('error면 feedback text가 노출된다.', () => {
    useRender({
      component: (
        <DateInputHarness
          initialValue="2026-03-05"
          error
          errorMessage="feedback text"
        />
      ),
    });

    expect(screen.getByText('feedback text')).toBeInTheDocument();
  });

  it('label을 넘기면 라벨 텍스트가 보인다.', () => {
    useRender({ component: <DateInputHarness label="날짜" /> });
    expect(screen.getByText('날짜')).toBeInTheDocument();
  });
});
