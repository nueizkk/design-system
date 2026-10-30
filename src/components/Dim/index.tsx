import { useEffect } from 'react';

import { createPortal } from 'react-dom';

interface IDimProps {
  /** 딤을 눌렀을 때. 보통 닫기다. 안 넘기면 눌러도 아무 일이 없다. */
  onClick?: () => void;
}

/**
 * 화면 전체를 덮는 어두운 막(Figma Modal 문서의 `Material/Dim`).
 *
 * `Modal`과 `Drawer`가 **같은 막을 쓴다.** 전에는 Drawer가 `react-modern-drawer`의
 * 오버레이에 색만 덮어쓰고 있어서, 같은 딤이 두 가지 방식으로 그려졌다.
 *
 * **body로 포탈한다.** 조상에 스태킹 컨텍스트가 있으면(`transform`·`filter`·
 * `position` 등) `z-backdrop`이 그 밖으로 못 나가 화면 일부만 덮인다.
 *
 * 열려 있는 동안 배경 스크롤을 잠근다.
 */
export function Dim({ onClick }: IDimProps) {
  useEffect(() => {
    const body = document.body;
    body.classList.add('scroll-lock');
    return () => {
      body.classList.remove('scroll-lock');
    };
  }, []);

  return createPortal(
    <div onClick={onClick} className="bg-material-dim z-backdrop fixed inset-0" />,
    document.body,
  );
}

export default Dim;
