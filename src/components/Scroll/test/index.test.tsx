import { fireEvent, screen } from '@testing-library/react';
import { useRender } from 'test-util';

import { Scroll } from '..';

/**
 * jsdom은 레이아웃을 계산하지 않아 `offsetHeight`와 `getBoundingClientRect`가
 * 모두 0이다. thumb 드래그·트랙 클릭은 그 둘로 스크롤 위치를 역산하므로
 * 실제 값처럼 보이게 고정해 둔다.
 */
const mockThumbAndTrack = (thumbHeight: number, trackTop: number) => {
  const thumb = screen.getByTestId('scrollThumb');
  Object.defineProperty(thumb, 'offsetHeight', {
    value: thumbHeight,
    configurable: true,
  });

  const track = thumb.parentElement as HTMLElement;
  track.getBoundingClientRect = () =>
    ({ top: trackTop }) as DOMRect;

  return { thumb, track };
};

const mockSize = (clientHeight: number, scrollHeight: number) => {
  const content = screen.getByTestId('scrollContent');
  Object.defineProperty(content, 'clientHeight', {
    value: clientHeight,
    configurable: true,
  });
  Object.defineProperty(content, 'scrollHeight', {
    value: scrollHeight,
    configurable: true,
  });
  fireEvent.scroll(content);
  return content;
};

describe('기본 동작', () => {
  it('스크롤이 필요 없으면 thumb를 숨긴다.', async () => {
    await useRender({ component: <Scroll maxHeight={200}>content</Scroll> });

    mockSize(200, 200);

    expect(screen.getByTestId('scrollThumb')).toHaveStyle({ opacity: '0' });
  });

  it('비율 계산값이 24px 이상 90% 이하면 그대로 사용한다.', async () => {
    await useRender({ component: <Scroll maxHeight={200}>content</Scroll> });

    // availableHeight = 200-8 = 192, ratio = 200/800 = 0.25 → 48px
    mockSize(200, 800);

    expect(screen.getByTestId('scrollThumb')).toHaveStyle({
      opacity: '1',
      height: '48px',
    });
  });

  it('비율 계산값이 24px 미만이면 24px(min)로 보정한다.', async () => {
    await useRender({ component: <Scroll maxHeight={100}>content</Scroll> });

    // availableHeight = 100-8 = 92, ratio = 100/1000 = 0.1 → raw 9.2px → min 24px
    mockSize(100, 1000);

    expect(screen.getByTestId('scrollThumb')).toHaveStyle({ height: '24px' });
  });

  it('비율 계산값이 트랙 가용 높이의 90%를 초과하면 90%로 제한한다.', async () => {
    await useRender({ component: <Scroll maxHeight={108}>content</Scroll> });

    // availableHeight = 108-8 = 100, ratio = 108/110 ≈ 0.982 → raw 98.2px → max 90px
    mockSize(108, 110);

    expect(screen.getByTestId('scrollThumb')).toHaveStyle({ height: '90px' });
  });
});

describe('thumb 드래그', () => {
  it('끈 거리에 비례해 scrollTop이 움직인다.', async () => {
    await useRender({ component: <Scroll maxHeight={200}>content</Scroll> });

    const content = mockSize(200, 800);
    const { thumb } = mockThumbAndTrack(48, 0);

    // availableHeight 192, maxThumbTop 192-48 = 144, scrollableHeight 800-200 = 600
    // 72px 끌면 ratio 0.5 → scrollTop 300
    fireEvent.mouseDown(thumb, { clientY: 0 });
    fireEvent.mouseMove(window, { clientY: 72 });

    expect(content.scrollTop).toBe(300);
  });

  it('드래그는 시작 시점의 scrollTop을 기준으로 누적된다.', async () => {
    await useRender({ component: <Scroll maxHeight={200}>content</Scroll> });

    const content = mockSize(200, 800);
    const { thumb } = mockThumbAndTrack(48, 0);
    content.scrollTop = 100;

    fireEvent.mouseDown(thumb, { clientY: 0 });
    fireEvent.mouseMove(window, { clientY: 72 });

    expect(content.scrollTop).toBe(400);
  });

  it('mouseup 뒤에는 더 이상 따라가지 않는다.', async () => {
    await useRender({ component: <Scroll maxHeight={200}>content</Scroll> });

    const content = mockSize(200, 800);
    const { thumb } = mockThumbAndTrack(48, 0);

    fireEvent.mouseDown(thumb, { clientY: 0 });
    fireEvent.mouseMove(window, { clientY: 72 });
    fireEvent.mouseUp(window);
    fireEvent.mouseMove(window, { clientY: 144 });

    expect(content.scrollTop).toBe(300);
  });
});

describe('트랙 클릭', () => {
  it('누른 지점의 비율로 scrollTop을 옮긴다.', async () => {
    await useRender({ component: <Scroll maxHeight={200}>content</Scroll> });

    const content = mockSize(200, 800);
    const { track } = mockThumbAndTrack(48, 0);

    // offsetY = 76 - 0 - 4(TRACK_PADDING) = 72, maxThumbTop 144 → ratio 0.5
    fireEvent.mouseDown(track, { clientY: 76 });

    expect(content.scrollTop).toBe(300);
  });

  it('트랙이 화면 아래에 있어도 트랙 기준으로 계산한다.', async () => {
    await useRender({ component: <Scroll maxHeight={200}>content</Scroll> });

    const content = mockSize(200, 800);
    const { track } = mockThumbAndTrack(48, 500);

    // trackTop 500이므로 offsetY = 576 - 500 - 4 = 72 → 같은 결과
    fireEvent.mouseDown(track, { clientY: 576 });

    expect(content.scrollTop).toBe(300);
  });
});
