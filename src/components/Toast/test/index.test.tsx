import { act, screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Toast } from '..';

describe('기본 동작', () => {
  it('type=success면 Success 타이틀을 표시한다.', async () => {
    await useRender({ component: <Toast type="success" description="완료" /> });

    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('완료')).toBeInTheDocument();
  });

  it('type=error면 Error 타이틀을 표시한다.', async () => {
    await useRender({ component: <Toast type="error" description="실패" /> });

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('실패')).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 closeToast를 호출한다.', async () => {
    const closeToast = jest.fn();
    const { user, container } = await useRender({
      component: <Toast type="success" closeToast={closeToast} />,
    });

    const closeIcon = container.querySelectorAll('svg')[1];

    await act(async () => {
      await user.click(closeIcon);
    });

    expect(closeToast).toHaveBeenCalled();
  });
});
