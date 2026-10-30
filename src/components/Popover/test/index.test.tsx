import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { useRender } from 'test-util';

import { Popover } from '..';

afterEach(() => {
  jest.restoreAllMocks();
  document.body.style.paddingBottom = '';
  delete document.body.dataset.autoScrollAmount;
});

describe('기본 동작', () => {
  it('열려있어도 body 스크롤을 잠그지 않는다(스크롤 시 재측정으로 대체).', async () => {
    const { user } = await useRender({
      component: (
        <Popover align="start">
          <Popover.Trigger>
            <button type="button">열기</button>
          </Popover.Trigger>
          <div>내용</div>
        </Popover>
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('열기'));
    });

    expect(screen.getByText('내용')).toBeInTheDocument();
    expect(document.body).not.toHaveClass('overflow-hidden');
  });

  it('openOnHover면 마우스 진입 시 열리고 이탈 시 닫힌다.', async () => {
    await useRender({
      component: (
        <Popover align="start" openOnHover>
          <Popover.Trigger>
            <button type="button">호버</button>
          </Popover.Trigger>
          <div>내용</div>
        </Popover>
      ),
    });

    const wrapper = screen.getByText('호버').parentElement!.parentElement!;

    await act(async () => {
      fireEvent.mouseEnter(wrapper);
    });
    expect(screen.getByText('내용')).toBeInTheDocument();

    /** 트리거와 패널 사이 틈을 지날 때 깜빡이지 않도록 닫힘은 한 프레임 미뤄진다. */
    await act(async () => {
      fireEvent.mouseLeave(wrapper);
    });
    await waitFor(() => {
      expect(screen.queryByText('내용')).not.toBeInTheDocument();
    });
  });

  it('openOnHover면 클릭이 관여하지 않는다 — 열린 채로 눌러도 닫히지 않는다.', async () => {
    const { user } = await useRender({
      component: (
        <Popover align="start" openOnHover>
          <Popover.Trigger>
            <button type="button">호버</button>
          </Popover.Trigger>
          <div>내용</div>
        </Popover>
      ),
    });

    const wrapper = screen.getByText('호버').parentElement!.parentElement!;
    await act(async () => {
      fireEvent.mouseEnter(wrapper);
    });
    expect(screen.getByText('내용')).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByText('호버'));
    });
    expect(screen.getByText('내용')).toBeInTheDocument();
  });

  it('트리거가 뷰포트 밖으로 완전히 나가면 닫힌다.', async () => {
    const { user } = await useRender({
      component: (
        <Popover align="start">
          <Popover.Trigger>
            <button type="button">열기</button>
          </Popover.Trigger>
          <div>내용</div>
        </Popover>
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('열기'));
    });
    expect(screen.getByText('내용')).toBeInTheDocument();

    const triggerWrapper = screen.getByText('열기').parentElement!;
    jest.spyOn(triggerWrapper, 'getBoundingClientRect').mockReturnValue({
      top: -100,
      bottom: -50,
      left: 0,
      right: 100,
      width: 100,
      height: 50,
      x: 0,
      y: -100,
      toJSON: () => {},
    } as DOMRect);

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(screen.queryByText('내용')).not.toBeInTheDocument();
  });

  it('뷰포트 밖으로 나가 닫힌 뒤, 트리거를 다시 클릭하면 한 번에 열린다.', async () => {
    const { user } = await useRender({
      component: (
        <Popover align="start">
          <Popover.Trigger>
            <button type="button">열기</button>
          </Popover.Trigger>
          <div>내용</div>
        </Popover>
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('열기'));
    });
    expect(screen.getByText('내용')).toBeInTheDocument();

    const triggerWrapper = screen.getByText('열기').parentElement!;
    const rectSpy = jest
      .spyOn(triggerWrapper, 'getBoundingClientRect')
      .mockReturnValue({
        top: -100,
        bottom: -50,
        left: 0,
        right: 100,
        width: 100,
        height: 50,
        x: 0,
        y: -100,
        toJSON: () => {},
      } as DOMRect);

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(screen.queryByText('내용')).not.toBeInTheDocument();

    // 스크롤을 되돌려 트리거가 다시 화면 안으로 들어왔다고 가정한다.
    rectSpy.mockReturnValue({
      top: 100,
      bottom: 150,
      left: 0,
      right: 100,
      width: 100,
      height: 50,
      x: 0,
      y: 100,
      toJSON: () => {},
    } as DOMRect);

    await act(async () => {
      await user.click(screen.getByText('열기'));
    });

    expect(screen.getByText('내용')).toBeInTheDocument();
  });

  it('패널이 화면 아래로 넘치면 미리 스크롤해서 넘치지 않게 만든다.', async () => {
    const scrollBySpy = jest.spyOn(window, 'scrollBy').mockImplementation(() => {});
    jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        if (this.id === 'popoverContainer') {
          return {
            top: 0,
            bottom: 400,
            left: 0,
            right: 200,
            width: 200,
            height: 400,
            x: 0,
            y: 0,
            toJSON: () => {},
          } as DOMRect;
        }
        return {
          top: 700,
          bottom: 730,
          left: 0,
          right: 100,
          width: 100,
          height: 30,
          x: 0,
          y: 700,
          toJSON: () => {},
        } as DOMRect;
      });

    const { user } = await useRender({
      component: (
        <Popover align="start">
          <Popover.Trigger>
            <button type="button">열기</button>
          </Popover.Trigger>
          <div>내용</div>
        </Popover>
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('열기'));
    });

    expect(scrollBySpy).toHaveBeenCalledTimes(1);
    const [arg] = scrollBySpy.mock.calls[0];
    expect((arg as ScrollToOptions).top).toBeGreaterThan(0);
    expect(document.body.style.paddingBottom).not.toBe('');
  });

  it('보정 스크롤이 트리거 자체를 뷰포트 밖으로 밀어내지 않는다(뷰포트가 극단적으로 작은 경우).', async () => {
    const originalInnerHeight = window.innerHeight;
    Object.defineProperty(window, 'innerHeight', { value: 100, configurable: true });

    const scrollBySpy = jest.spyOn(window, 'scrollBy').mockImplementation(() => {});
    jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        if (this.id === 'popoverContainer') {
          return {
            top: 0,
            bottom: 500,
            left: 0,
            right: 200,
            width: 200,
            height: 500,
            x: 0,
            y: 0,
            toJSON: () => {},
          } as DOMRect;
        }
        // 트리거가 뷰포트(100px) 안, 위쪽에 있어 아래로 넘칠 공간이 거의 없다.
        return {
          top: 20,
          bottom: 50,
          left: 0,
          right: 100,
          width: 100,
          height: 30,
          x: 0,
          y: 20,
          toJSON: () => {},
        } as DOMRect;
      });

    const { user } = await useRender({
      component: (
        <Popover align="start">
          <Popover.Trigger>
            <button type="button">열기</button>
          </Popover.Trigger>
          <div>내용</div>
        </Popover>
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('열기'));
    });

    // 트리거(bottom=50)를 완전히 가리지 않도록, 필요한 보정량(450+16=466)이 아니라
    // 트리거 아래 최소 8px은 남기는 선(50-8=42)까지만 스크롤해야 한다.
    expect(scrollBySpy).toHaveBeenCalledTimes(1);
    const [arg] = scrollBySpy.mock.calls[0];
    const scrollAmount = (arg as ScrollToOptions).top as number;
    expect(scrollAmount).toBeLessThan(466);
    expect(50 - scrollAmount).toBeGreaterThanOrEqual(8);

    Object.defineProperty(window, 'innerHeight', {
      value: originalInnerHeight,
      configurable: true,
    });
  });

  it('패널이 뷰포트보다 커도 스크롤할 때마다 다시 개입하지 않는다.', async () => {
    let triggerBottom = 730;
    jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        if (this.id === 'popoverContainer') {
          // 뷰포트(jsdom 기본 768px)보다 큰 패널 — 아무리 스크롤해도 overflow가 0 밑으로 안 내려감
          return {
            top: 0,
            bottom: 2000,
            left: 0,
            right: 200,
            width: 200,
            height: 2000,
            x: 0,
            y: 0,
            toJSON: () => {},
          } as DOMRect;
        }
        return {
          top: triggerBottom - 30,
          bottom: triggerBottom,
          left: 0,
          right: 100,
          width: 100,
          height: 30,
          x: 0,
          y: triggerBottom - 30,
          toJSON: () => {},
        } as DOMRect;
      });
    const scrollBySpy = jest.spyOn(window, 'scrollBy').mockImplementation(() => {});

    const { user } = await useRender({
      component: (
        <Popover align="start">
          <Popover.Trigger>
            <button type="button">열기</button>
          </Popover.Trigger>
          <div>내용</div>
        </Popover>
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('열기'));
    });
    expect(scrollBySpy).toHaveBeenCalledTimes(1);

    // 사용자가 스크롤을 계속 시도하는 상황(트리거가 화면 위로 계속 이동)을 흉내낸다.
    for (let i = 0; i < 5; i++) {
      triggerBottom -= 50;
      await act(async () => {
        window.dispatchEvent(new Event('scroll'));
      });
    }

    // 최초 1번 이후로는 사용자의 스크롤에 더 이상 개입하지 않아야 한다.
    expect(scrollBySpy).toHaveBeenCalledTimes(1);
  });

  it('닫았다 다시 열어도 스크롤 보정이 중복 적용되지 않는다.', async () => {
    const scrollBySpy = jest.spyOn(window, 'scrollBy').mockImplementation(() => {});
    jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        if (this.id === 'popoverContainer') {
          return {
            top: 0,
            bottom: 400,
            left: 0,
            right: 200,
            width: 200,
            height: 400,
            x: 0,
            y: 0,
            toJSON: () => {},
          } as DOMRect;
        }
        return {
          top: 700,
          bottom: 730,
          left: 0,
          right: 100,
          width: 100,
          height: 30,
          x: 0,
          y: 700,
          toJSON: () => {},
        } as DOMRect;
      });

    const { user } = await useRender({
      component: (
        <Popover align="start">
          <Popover.Trigger>
            <button type="button">열기</button>
          </Popover.Trigger>
          <div>내용</div>
        </Popover>
      ),
    });

    // 열기 → 닫기 → 다시 열기
    await act(async () => {
      await user.click(screen.getByText('열기'));
    });
    await act(async () => {
      await user.click(screen.getByText('열기'));
    });
    await act(async () => {
      await user.click(screen.getByText('열기'));
    });

    // +378(1차 오픈), -378(닫기 복원), +378(2차 오픈) — 매번 정확히 한 번씩만 적용돼야 한다.
    const amounts = scrollBySpy.mock.calls.map(
      ([arg]) => (arg as ScrollToOptions).top,
    );
    expect(amounts).toEqual([378, -378, 378]);
  });

  it('side="top"이면 화면 위로 넘칠 때 반대 방향(음수)으로 미리 스크롤한다.', async () => {
    const scrollBySpy = jest.spyOn(window, 'scrollBy').mockImplementation(() => {});
    jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        if (this.id === 'popoverContainer') {
          return {
            top: 0,
            bottom: 200,
            left: 0,
            right: 200,
            width: 200,
            height: 200,
            x: 0,
            y: 0,
            toJSON: () => {},
          } as DOMRect;
        }
        return {
          top: 10,
          bottom: 40,
          left: 0,
          right: 100,
          width: 100,
          height: 30,
          x: 0,
          y: 10,
          toJSON: () => {},
        } as DOMRect;
      });

    const { user } = await useRender({
      component: (
        <Popover align="start" side="top">
          <Popover.Trigger>
            <button type="button">열기</button>
          </Popover.Trigger>
          <div>내용</div>
        </Popover>
      ),
    });

    await act(async () => {
      await user.click(screen.getByText('열기'));
    });

    expect(scrollBySpy).toHaveBeenCalled();
    const [arg] = scrollBySpy.mock.calls[0];
    expect((arg as ScrollToOptions).top).toBeLessThan(0);
    // side="top"일 땐 paddingBottom을 안 건드린다.
    expect(document.body.style.paddingBottom).toBe('');
  });
});
