import { useRender } from 'test-util';

import { BarSpinner } from '../BarSpinner';

describe('기본 동작', () => {
  it('24x24 고정 크기로 렌더링한다.', async () => {
    const { container } = await useRender({ component: <BarSpinner /> });

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24px');
    expect(svg).toHaveAttribute('height', '24px');
  });

  it('회전 애니메이션 클래스를 적용한다.', async () => {
    const { container } = await useRender({ component: <BarSpinner /> });

    expect(container.querySelector('svg')).toHaveClass(
      'animate-[spin_1.5s_linear_infinite]',
    );
  });
});
