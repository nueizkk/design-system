import { ReactNode } from 'react';

interface IModalFooterProps {
  children: ReactNode;
}

/**
 * 모달 하단 버튼 영역(Figma `Modal/Footer`). prop이 `children` 하나인 것은
 * Figma도 같다 — 배치 variant가 컴포넌트에 없다.
 *
 * **여백만 책임진다**(상 16 · 하 36 · 좌우 36). 버튼을 어떻게 늘어놓을지는
 * 화면마다 달라서 호출부가 정한다.
 *
 * 높이는 내용에 맡긴다. Figma 문서는 "기본 108px, input-text 조합은 126px"이라고
 * 적어뒀지만, 고정하면 버튼 크기가 달라질 때마다 숫자를 다시 맞춰야 한다 —
 * `md` 버튼(48) + 패딩(16+36)이면 100이라 이미 8px 어긋난다.
 *
 * ```tsx
 * <Modal.Footer>
 *   <div className="flex justify-end gap-4">
 *     <Button variant="secondary">취소</Button>
 *     <Button>확인</Button>
 *   </div>
 * </Modal.Footer>
 * ```
 */
function ModalFooter({ children }: IModalFooterProps) {
  return <div className="w-full rounded-b-lg px-9 pb-9 pt-4">{children}</div>;
}

export default ModalFooter;
