import { RefObject, useEffect, useState } from 'react';

/**
 * 요소의 내용이 말줄임됐는지. 가로로 넘쳤는지(`scrollWidth > clientWidth`)로 본다.
 *
 * 칸 폭은 창 크기·사이드바 접힘·컬럼 구성에 따라 바뀌므로 한 번 재고 끝내면 안 된다.
 * `ResizeObserver`로 요소 자신의 크기를 따라간다.
 */
export function useTruncated(ref: RefObject<HTMLElement | null>) {
  const [isTruncated, setTruncated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () =>
      setTruncated(element.scrollWidth > element.clientWidth);

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  });

  return isTruncated;
}
