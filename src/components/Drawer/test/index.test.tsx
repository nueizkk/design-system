import { act, screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Drawer } from '..';

describe('Drawer', () => {
  it('Header/Body/Footer의 children을 각각 렌더링한다.', async () => {
    await useRender({
      component: (
        <Drawer isOpen onClose={jest.fn()}>
          <Drawer.Header title="상세 정보" subTitle="부가 설명" />
          <Drawer.Body>본문 콘텐츠</Drawer.Body>
          <Drawer.Footer>
            <button>저장</button>
          </Drawer.Footer>
        </Drawer>
      ),
    });

    expect(screen.getByText('상세 정보')).toBeInTheDocument();
    expect(screen.getByText('부가 설명')).toBeInTheDocument();
    expect(screen.getByText('본문 콘텐츠')).toBeInTheDocument();
    expect(screen.getByText('저장')).toBeInTheDocument();
  });

  it('Footer 없이 Header/Body만으로도 렌더링된다.', async () => {
    await useRender({
      component: (
        <Drawer isOpen onClose={jest.fn()}>
          <Drawer.Header title="조회 전용" />
          <Drawer.Body>편집 액션이 없는 화면입니다.</Drawer.Body>
        </Drawer>
      ),
    });

    expect(screen.getByText('조회 전용')).toBeInTheDocument();
    expect(screen.getByText('편집 액션이 없는 화면입니다.')).toBeInTheDocument();
  });

  it('Header의 닫기 아이콘을 클릭하면 onClose가 호출된다.', async () => {
    const onClose = jest.fn();
    const { user, container } = await useRender({
      component: (
        <Drawer isOpen onClose={onClose}>
          <Drawer.Header title="상세 정보" />
          <Drawer.Body>본문</Drawer.Body>
        </Drawer>
      ),
    });

    await user.click(container.querySelector('svg') as SVGElement);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Body의 Header/Footer 간격(mt-8 mb-8)은 스크롤 영역이 아니라 바깥 래퍼의 margin이다.', async () => {
    const { container } = await useRender({
      component: (
        <Drawer isOpen onClose={jest.fn()}>
          <Drawer.Body>본문</Drawer.Body>
        </Drawer>
      ),
    });

    const scrollContent = container.querySelector('[data-testid="scrollContent"]');
    expect(scrollContent).not.toHaveClass('mt-8', 'mb-8');
    expect(scrollContent?.parentElement?.parentElement).toHaveClass(
      'mt-8',
      'mb-8',
    );
  });

  it('Body는 Scroll 컴포넌트로 콘텐츠를 감싼다.', async () => {
    const { container } = await useRender({
      component: (
        <Drawer isOpen onClose={jest.fn()}>
          <Drawer.Body>본문</Drawer.Body>
        </Drawer>
      ),
    });

    expect(
      container.querySelector('[data-testid="scrollContent"]'),
    ).toHaveTextContent('본문');
  });

  it('닫아도 슬라이드 애니메이션이 끝나기 전까지는 children이 유지된다.', async () => {
    jest.useFakeTimers();
    const onClose = jest.fn();
    const { rerender } = await useRender({
      component: (
        <Drawer isOpen onClose={onClose}>
          <Drawer.Body>본문</Drawer.Body>
        </Drawer>
      ),
    });

    rerender(
      <Drawer isOpen={false} onClose={onClose}>
        <Drawer.Body>본문</Drawer.Body>
      </Drawer>,
    );

    expect(screen.getByText('본문')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.queryByText('본문')).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  it('닫힌 뒤 다시 열면 이전 state 없이 새로 마운트된다(스크롤 위치 포함).', async () => {
    jest.useFakeTimers();
    const onClose = jest.fn();
    const { rerender, container } = await useRender({
      component: (
        <Drawer isOpen onClose={onClose}>
          <Drawer.Body>본문</Drawer.Body>
        </Drawer>
      ),
    });

    const scrollContentBefore = container.querySelector(
      '[data-testid="scrollContent"]',
    ) as HTMLDivElement;
    scrollContentBefore.scrollTop = 200;

    rerender(
      <Drawer isOpen={false} onClose={onClose}>
        <Drawer.Body>본문</Drawer.Body>
      </Drawer>,
    );
    act(() => {
      jest.advanceTimersByTime(500);
    });

    rerender(
      <Drawer isOpen onClose={onClose}>
        <Drawer.Body>본문</Drawer.Body>
      </Drawer>,
    );

    const scrollContentAfter = container.querySelector(
      '[data-testid="scrollContent"]',
    ) as HTMLDivElement;
    expect(scrollContentAfter).not.toBe(scrollContentBefore);
    expect(scrollContentAfter.scrollTop).toBe(0);
    jest.useRealTimers();
  });
});
