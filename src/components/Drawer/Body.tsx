import { ReactNode, useLayoutEffect, useRef, useState } from "react";

import { Scroll } from "../Scroll";

interface IDrawerBodyProps {
  children: ReactNode;
}

export function DrawerBody({ children }: IDrawerBodyProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const updateMaxHeight = () => setMaxHeight(el.clientHeight);
    updateMaxHeight();

    const resizeObserver = new ResizeObserver(updateMaxHeight);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="min-h-0 flex-1 mb-8 mt-8">
      <Scroll maxHeight={maxHeight}>{children}</Scroll>
    </div>
  );
}
