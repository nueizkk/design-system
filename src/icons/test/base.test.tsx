import { render } from '@testing-library/react';

import * as Icon from '..';

const svgOf = (ui: React.ReactElement) =>
  render(ui).container.querySelector('svg')!;

describe('IconBase', () => {
  it('fill="currentColor"로 그려 text-* 색을 따른다.', () => {
    const svg = svgOf(<Icon.Star />);

    expect(svg).toHaveAttribute('fill', 'currentColor');
    expect(svg).toHaveClass('text-label-normal');
  });

  it('color를 주면 해당 토큰 클래스가 붙는다.', () => {
    expect(svgOf(<Icon.Star color="status-main-negative" />)).toHaveClass(
      'text-status-main-negative',
    );
  });

  it('size는 리터럴 클래스로 나간다.', () => {
    expect(svgOf(<Icon.Star size="xs" />)).toHaveClass('w-[12px]');
  });

  it('cursor는 SVG 네이티브 속성으로 나간다.', () => {
    expect(svgOf(<Icon.Star cursor="pointer" />)).toHaveAttribute(
      'cursor',
      'pointer',
    );
  });

  it('path에 자체 fill이 없어야 색이 상속된다(다색 아이콘 제외).', () => {
    const svg = svgOf(<Icon.StarSolid />);

    expect(svg.querySelector('path')).not.toHaveAttribute('fill');
  });
});
