import { useEffect, useState } from 'react';

export const useGetIsDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // 초기 값 설정
    checkDarkMode();

    // MutationObserver 생성
    const observer = new MutationObserver(() => {
      checkDarkMode();
    });

    // html 태그의 class 속성 변경 감지
    observer.observe(document.documentElement, {
      attributes: true, // 속성(attribute) 변경 감지
      attributeFilter: ['class'], // class 속성만 감지
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return isDarkMode;
};
