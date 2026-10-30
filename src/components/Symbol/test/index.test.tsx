import { useRender } from 'test-util';

import { Symbol } from '..';

describe('기본 동작', () => {
  it('size 미지정 시 기본값 md(16px)로 렌더링한다.', async () => {
    const { container } = await useRender({ component: <Symbol /> });

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '16px');
    expect(svg).toHaveAttribute('height', '16px');
  });

  it.each([
    ['lg', '24px'],
    ['xl', '28px'],
  ] as const)('size=%s면 %s 정사각형으로 렌더링한다.', async (size, expected) => {
    const { container } = await useRender({ component: <Symbol size={size} /> });

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', expected);
    expect(svg).toHaveAttribute('height', expected);
  });
});
