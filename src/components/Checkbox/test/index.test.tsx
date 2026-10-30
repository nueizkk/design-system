import { act, screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Checkbox } from '..';

describe('기본 동작', () => {
  it('checked=false면 아이콘이 없다.', async () => {
    await useRender({ component: <Checkbox checked={false} /> });

    expect(screen.queryByTestId('checkboxCheckIcon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('checkboxPartialIcon')).not.toBeInTheDocument();
  });

  it('checked=true면 체크 아이콘을 표시한다.', async () => {
    await useRender({ component: <Checkbox checked={true} /> });

    expect(screen.getByTestId('checkboxCheckIcon')).toBeInTheDocument();
  });

  it('defaultChecked=true면 초기부터 체크 아이콘을 표시한다.', async () => {
    await useRender({ component: <Checkbox defaultChecked={true} /> });

    expect(screen.getByTestId('checkboxCheckIcon')).toBeInTheDocument();
  });

  it("defaultChecked='partial'이면 초기부터 마이너스 아이콘을 표시한다.", async () => {
    await useRender({ component: <Checkbox defaultChecked="partial" /> });

    expect(screen.getByTestId('checkboxPartialIcon')).toBeInTheDocument();
  });

  it("checked='partial'이면 마이너스 아이콘을 표시한다.", async () => {
    await useRender({ component: <Checkbox checked="partial" /> });

    expect(screen.getByTestId('checkboxPartialIcon')).toBeInTheDocument();
    expect(screen.queryByTestId('checkboxCheckIcon')).not.toBeInTheDocument();
  });

  it('클릭 시 false -> true로 전환된다.', async () => {
    const onCheck = jest.fn();
    const { user } = await useRender({
      component: <Checkbox checked={false} onCheck={onCheck} />,
    });

    await act(async () => {
      await user.click(screen.getByRole('checkbox'));
    });

    expect(onCheck).toHaveBeenCalledWith(true);
  });

  it('클릭 시 true -> false로 전환된다.', async () => {
    const onCheck = jest.fn();
    const { user } = await useRender({
      component: <Checkbox checked={true} onCheck={onCheck} />,
    });

    await act(async () => {
      await user.click(screen.getByRole('checkbox'));
    });

    expect(onCheck).toHaveBeenCalledWith(false);
  });

  it("클릭 시 partial -> true(전체 선택)로 전환된다.", async () => {
    const onCheck = jest.fn();
    const { user } = await useRender({
      component: <Checkbox checked="partial" onCheck={onCheck} />,
    });

    await act(async () => {
      await user.click(screen.getByRole('checkbox'));
    });

    expect(onCheck).toHaveBeenCalledWith(true);
  });

  it('disabled면 클릭해도 onCheck가 호출되지 않는다.', async () => {
    const onCheck = jest.fn();
    const { user } = await useRender({
      component: <Checkbox checked={false} disabled onCheck={onCheck} />,
    });

    await act(async () => {
      await user.click(screen.getByRole('checkbox'));
    });

    expect(onCheck).not.toHaveBeenCalled();
  });
});
