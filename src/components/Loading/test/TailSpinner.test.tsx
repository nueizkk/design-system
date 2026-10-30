import { useRender } from 'test-util';

import { TailSpinner } from '../TailSpinner';

describe('기본 동작', () => {
  it('color=primary면 stroke-primary-normal 클래스를 적용한다.', async () => {
    const { container } = await useRender({
      component: <TailSpinner color="primary" size="lg" />,
    });

    expect(container.querySelector('path')).toHaveClass(
      'stroke-primary-normal',
    );
  });

  it('color=white면 stroke-static-white 클래스를 적용한다.', async () => {
    const { container } = await useRender({
      component: <TailSpinner color="white" size="lg" />,
    });

    expect(container.querySelector('path')).toHaveClass('stroke-static-white');
  });

  it('size=md면 20x20으로 렌더링한다.', async () => {
    const { container } = await useRender({
      component: <TailSpinner color="primary" size="md" />,
    });

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '20px');
    expect(svg).toHaveAttribute('height', '20px');
  });

  it('size=lg면 24x24로 렌더링한다.', async () => {
    const { container } = await useRender({
      component: <TailSpinner color="primary" size="lg" />,
    });

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '24px');
    expect(svg).toHaveAttribute('height', '24px');
  });
});
