import { act, screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Option } from '..';
import * as Icon from '../../../icons';

describe('기본 동작', () => {
  it('label을 렌더링한다.', async () => {
    await useRender({ component: <Option size="xs" value="list" label="list" /> });

    expect(screen.getByText('list')).toBeInTheDocument();
  });

  it('클릭 시 onClick이 호출된다.', async () => {
    const onClick = jest.fn();
    const { user } = await useRender({
      component: <Option size="xs" value="list" label="list" onClick={onClick} />,
    });

    await act(async () => {
      await user.click(screen.getByText('list'));
    });

    expect(onClick).toHaveBeenCalled();
  });

  it('disabled면 클릭해도 onClick이 호출되지 않는다.', async () => {
    const onClick = jest.fn();
    const { user } = await useRender({
      component: <Option size="xs" value="list" label="list" disabled onClick={onClick} />,
    });

    await act(async () => {
      await user.click(screen.getByText('list'));
    });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('disabled여도 rightIcon은 렌더링되지만 클릭은 막힌다.', async () => {
    const onRightIconClick = jest.fn();
    const { user } = await useRender({
      component: (
        <Option
          size="xs"
          value="list"
          label="list"
          rightIcon={Icon.Question}
          onRightIconClick={onRightIconClick}
          disabled
        />
      ),
    });

    expect(screen.getByTestId('optionRightIcon')).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByTestId('optionRightIcon'));
    });

    expect(onRightIconClick).not.toHaveBeenCalled();
  });

  it('rightIcon 클릭은 onClick으로 전파되지 않는다.', async () => {
    const onClick = jest.fn();
    const onRightIconClick = jest.fn();
    const { user } = await useRender({
      component: (
        <Option
          size="xs"
          value="list"
          label="list"
          rightIcon={Icon.Question}
          onClick={onClick}
          onRightIconClick={onRightIconClick}
        />
      ),
    });

    await act(async () => {
      await user.click(screen.getByTestId('optionRightIcon'));
    });

    expect(onRightIconClick).toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
