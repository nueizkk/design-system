import { act, screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Button } from '..';

describe('기본 동작', () => {
  it('children을 렌더링한다.', async () => {
    await useRender({
      component: (
        <Button size="md" onClick={jest.fn()}>
          버튼
        </Button>
      ),
    });

    expect(screen.getByText('버튼')).toBeInTheDocument();
  });

  it('클릭하면 onClick이 호출된다.', async () => {
    const onClick = jest.fn();
    const { user } = await useRender({
      component: (
        <Button size="md" onClick={onClick}>
          버튼
        </Button>
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('버튼'));
    });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disabled면 클릭해도 onClick이 호출되지 않는다.', async () => {
    const onClick = jest.fn();
    const { user } = await useRender({
      component: (
        <Button size="md" onClick={onClick} disabled>
          버튼
        </Button>
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('버튼'));
    });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('isLoading이면 클릭해도 onClick이 호출되지 않는다.', async () => {
    const onClick = jest.fn();
    const { user } = await useRender({
      component: (
        <Button size="md" onClick={onClick} isLoading>
          버튼
        </Button>
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('버튼'));
    });

    expect(onClick).not.toHaveBeenCalled();
  });
});
