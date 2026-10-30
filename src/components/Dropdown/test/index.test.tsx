import { act, screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Dropdown } from '..';
import { DropdownOptionType } from '../config';

describe('기본 동작', () => {
  it('트리거 클릭 시 옵션이 보인다.', async () => {
    const options: DropdownOptionType[][] = [
      [{ value: 'edit', label: '수정', onClick: jest.fn() }],
    ];
    const { user } = await useRender({
      component: (
        <Dropdown align="start" options={options}>
          <Dropdown.Trigger>
            <button type="button">열기</button>
          </Dropdown.Trigger>
        </Dropdown>
      ),
    });

    expect(screen.queryByText('수정')).not.toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByText('열기'));
    });

    expect(screen.getByText('수정')).toBeInTheDocument();
  });

  it('옵션 클릭 시 onClick이 호출되고 패널이 닫힌다.', async () => {
    const onClick = jest.fn();
    const options: DropdownOptionType[][] = [
      [{ value: 'edit', label: '수정', onClick }],
    ];
    const { user } = await useRender({
      component: (
        <Dropdown align="start" options={options}>
          <Dropdown.Trigger>
            <button type="button">열기</button>
          </Dropdown.Trigger>
        </Dropdown>
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('열기'));
    });
    await act(async () => {
      await user.click(screen.getByText('수정'));
    });

    expect(onClick).toHaveBeenCalledTimes(1);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(screen.queryByText('수정')).not.toBeInTheDocument();
  });

  it('disabled 옵션은 클릭해도 onClick이 호출되지 않는다.', async () => {
    const onClick = jest.fn();
    const options: DropdownOptionType[][] = [
      [{ value: 'archive', label: '보관', disabled: true, onClick }],
    ];
    const { user } = await useRender({
      component: (
        <Dropdown align="start" options={options}>
          <Dropdown.Trigger>
            <button type="button">열기</button>
          </Dropdown.Trigger>
        </Dropdown>
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('열기'));
    });
    await act(async () => {
      await user.click(screen.getByText('보관'));
    });

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByText('보관')).toBeInTheDocument();
  });

  it('옵션 그룹이 여러 개면 그룹 사이에 구분선이 보인다.', async () => {
    const options: DropdownOptionType[][] = [
      [{ value: 'a', label: '항목A', onClick: jest.fn() }],
      [{ value: 'b', label: '항목B', onClick: jest.fn() }],
    ];
    const { user } = await useRender({
      component: (
        <Dropdown align="start" options={options}>
          <Dropdown.Trigger>
            <button type="button">열기</button>
          </Dropdown.Trigger>
        </Dropdown>
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('열기'));
    });

    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});
