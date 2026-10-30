import React, { ElementType, ReactNode, useEffect, useState } from 'react';

interface IDeferredComponentProps {
  children: ReactNode;
  minWidth?: string;
  minHeight?: string;
  margin?: string;
  as?: ElementType;
  customDeferred?: ReactNode;
}

const DeferredComponent = ({
  children,
  minHeight,
  minWidth,
  margin,
  as = 'div',
  customDeferred,
}: IDeferredComponentProps) => {
  const [isDeferred, setIsDeferred] = useState(false);

  const DynamicTag = as;

  useEffect(() => {
    // 200ms 지난 후 children Render
    const timeoutId = setTimeout(() => {
      setIsDeferred(true);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, []);

  if (!isDeferred) {
    if (customDeferred) {
      return customDeferred;
    } else {
      return <DynamicTag style={{ minHeight, minWidth, margin }}></DynamicTag>;
    }
  }

  return <>{children}</>;
};

export default DeferredComponent;
