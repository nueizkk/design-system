import {
  forwardRef,
  HTMLAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import { cn } from '../utils/cn';

interface IScrollProps extends HTMLAttributes<HTMLDivElement> {
  maxHeight: number;
  containerClassName?: string;
}

/**
 * 브라우저 기본 스크롤바를 숨기고(overflow-y-scroll + 스크롤바 CSS 제거) 그 자리를
 * 대체하는 커스텀 thumb를 그리는 컴포넌트. thumb 높이/위치는 실제 스크롤 상태에서
 * 매번 계산될 뿐 별도 상태로 들고 있지 않음 — content DOM(scrollTop/scrollHeight/
 * clientHeight)이 유일한 source of truth.
 *
 * - thumbHeight = (뷰포트/콘텐츠 비율) × 가용 트랙 높이, [MIN_THUMB_HEIGHT, 90%] 클램프
 * - thumbTop = 스크롤 비율 × (가용 트랙 높이 − thumbHeight)
 * - 트랙 클릭/thumb 드래그는 위 식을 반대로 풀어 scrollTop을 역산
 * - ResizeObserver(뷰포트 변화), MutationObserver(콘텐츠 증감, 예: 무한스크롤)로
 *   scrollHeight가 바뀔 때마다 재계산 트리거
 */
export const Scroll = forwardRef<HTMLDivElement, IScrollProps>(
  ({ maxHeight, children, containerClassName, className, ...rest }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const TRACK_PADDING = 4; // Figma: Track padding spacing-1(4px 상하좌우)
    const MIN_THUMB_HEIGHT = 24; // Figma: min 24px
    const MAX_THUMB_RATIO = 0.9; // Figma: max 트랙 가용 높이의 90%

    useImperativeHandle(ref, () => contentRef.current!, []);

    /** availableHeight: 트랙 상하 패딩(4px×2)을 뺀, thumb가 실제로 움직일 수 있는 높이 */
    const getScrollMetrics = (content: HTMLDivElement) => {
      const { scrollHeight, clientHeight } = content;
      return {
        scrollableHeight: scrollHeight - clientHeight,
        availableHeight: clientHeight - TRACK_PADDING * 2,
      };
    };

    const handleClickTrack = (e: React.MouseEvent<HTMLDivElement>) => {
      const content = contentRef.current;
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (!content || !track || !thumb) return;

      const { scrollableHeight, availableHeight } = getScrollMetrics(content);
      const trackRect = track.getBoundingClientRect();
      const maxThumbTop = availableHeight - thumb.offsetHeight;
      const offsetY = e.clientY - trackRect.top - TRACK_PADDING;

      const scrollRatio = offsetY / maxThumbTop;
      const newScrollTop = scrollRatio * scrollableHeight;

      content.scrollTop = newScrollTop;
    };

    useEffect(() => {
      const content = contentRef.current;
      const thumb = thumbRef.current;

      if (!content || !thumb) return;

      const updateThumb = () => {
        const { scrollTop, scrollHeight, clientHeight } = content;

        if (scrollHeight <= clientHeight) {
          content.style.overflowY = 'hidden';
          thumb.style.opacity = '0';
          return;
        }
        content.style.overflowY = 'scroll';
        thumb.style.opacity = '1';

        const { scrollableHeight, availableHeight } = getScrollMetrics(content);
        const thumbHeight = Math.min(
          Math.max(
            availableHeight * (clientHeight / scrollHeight),
            MIN_THUMB_HEIGHT,
          ),
          availableHeight * MAX_THUMB_RATIO,
        );
        thumb.style.height = `${thumbHeight}px`;

        const maxThumbTop = availableHeight - thumbHeight;
        const scrollRatio = scrollTop / scrollableHeight;
        const thumbTop = scrollRatio * maxThumbTop;

        thumb.style.transform = `translateY(${thumbTop}px)`;
      };

      updateThumb(); // 초기 계산

      content.addEventListener('scroll', updateThumb);
      window.addEventListener('resize', updateThumb);

      const handleMouseDownThumb = (e: MouseEvent) => {
        e.preventDefault();

        const startY = e.clientY;
        const startScrollTop = content.scrollTop;
        const { scrollableHeight, availableHeight } = getScrollMetrics(content);
        const maxThumbTop = availableHeight - thumb.offsetHeight;

        const onMouseMove = (moveEvent: MouseEvent) => {
          const deltaY = moveEvent.clientY - startY;
          const scrollRatio = deltaY / maxThumbTop;
          const newScrollTop = startScrollTop + scrollRatio * scrollableHeight;
          content.scrollTop = newScrollTop;
        };

        const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      };

      thumb.addEventListener('mousedown', handleMouseDownThumb);

      const resizeObserver = new ResizeObserver(updateThumb);
      resizeObserver.observe(content);

      // 자식 DOM 변화(아이템 추가/제거) 시 스크롤 상태 재계산
      const mutationObserver = new MutationObserver(updateThumb);
      mutationObserver.observe(content, { childList: true, subtree: true });

      return () => {
        content.removeEventListener('scroll', updateThumb);
        window.removeEventListener('resize', updateThumb);
        thumb.removeEventListener('mousedown', handleMouseDownThumb);
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    }, []);

    return (
      <div
        className={cn(containerClassName, 'relative overflow-hidden')}
        style={{ maxHeight }}
      >
        <div
          ref={contentRef}
          data-testid="scrollContent"
          className={cn(
            className,
            'max-h-[inherit] overflow-y-scroll [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          )}
          {...rest}
        >
          {children}
        </div>
        <div
          ref={trackRef}
          onMouseDown={handleClickTrack}
          className="absolute right-0 top-0 h-full w-2.5"
        >
          <div
            ref={thumbRef}
            data-testid="scrollThumb"
            className="bg-line-strong rounded-xs absolute right-0 top-0 my-1 mr-1 h-6 w-1"
          />
        </div>
      </div>
    );
  },
);
