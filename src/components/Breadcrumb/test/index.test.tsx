import { screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Breadcrumb } from '..';

describe('기본 동작', () => {
  it('항목이 1개면 구분자 없이 텍스트만 표시한다.', async () => {
    const { container } = await useRender({
      component: <Breadcrumb items={['대시보드']} />,
    });

    expect(screen.getByText('대시보드')).toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it('항목이 n개면 구분자를 n-1개 항목 사이에만 배치한다.', async () => {
    const { container } = await useRender({
      component: <Breadcrumb items={['A', 'B', 'C']} />,
    });

    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });

  it('마지막 항목만 label-neutral, 나머지는 label-assistive 색상을 적용한다.', async () => {
    await useRender({
      component: <Breadcrumb items={['A', 'B']} />,
    });

    expect(screen.getByText('A')).toHaveClass('text-label-assistive');
    expect(screen.getByText('B')).toHaveClass('text-label-neutral');
  });
});
