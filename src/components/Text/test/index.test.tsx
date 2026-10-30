import { createRef } from 'react';

import { render, screen } from '@testing-library/react';

import { Text } from '..';

describe('Text', () => {
  it('기본적으로 span을 렌더한다.', () => {
    const { container } = render(<Text>텍스트</Text>);

    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('as로 엘리먼트를 바꿔도 시각 스타일(variant)은 그대로다.', () => {
    render(
      <Text as="h2" variant="subtitle-2">
        제목
      </Text>,
    );
    const heading = screen.getByRole('heading', { level: 2 });

    expect(heading).toHaveClass('typo-subtitle-2');
  });

  it('variant가 엘리먼트를 결정하지 않는다.', () => {
    const { container } = render(<Text variant="headline-1">큰 글씨</Text>);

    expect(container.querySelector('h1')).not.toBeInTheDocument();
    expect(container.querySelector('span')).toHaveClass('typo-headline-1');
  });

  it('color는 text-* 클래스로 나간다.', () => {
    render(<Text color="status-main-negative">경고</Text>);

    expect(screen.getByText('경고')).toHaveClass('text-status-main-negative');
  });

  it('color를 생략하면 label-normal이다.', () => {
    render(<Text>기본</Text>);

    expect(screen.getByText('기본')).toHaveClass('text-label-normal');
  });

  it('variant/weight 기본값은 body-1 / regular다.', () => {
    render(<Text>기본</Text>);
    const text = screen.getByText('기본');

    expect(text).toHaveClass('typo-body-1');
    expect(text).toHaveClass('font-regular');
  });

  it('ref가 실제 엘리먼트로 전달된다.', () => {
    const ref = createRef<HTMLElement>();
    render(<Text ref={ref}>텍스트</Text>);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('as를 바꾸면 그 엘리먼트로 ref가 전달된다.', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Text as="p" ref={ref}>
        문단
      </Text>,
    );

    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });

  it('className이 variant 클래스와 함께 적용된다.', () => {
    render(<Text className="truncate">긴 텍스트</Text>);
    const text = screen.getByText('긴 텍스트');

    expect(text).toHaveClass('truncate');
    expect(text).toHaveClass('typo-body-1');
  });
});
