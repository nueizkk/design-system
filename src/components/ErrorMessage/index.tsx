import { Text } from '../Text';

interface IErrorMessageProps {
  /**
   * 한 줄 기준 자유 문자열. **이미 번역된** 문구를 받는다 — DS는 i18n 키를 모른다.
   */
  message: string;
}

/**
 * 입력 계열(Input·Textarea·SelectBox 등) 아래에 공통으로 붙는 에러 피드백 텍스트
 * (Figma `34381:18`). Figma에서도 Input의 error 심볼이 이 인스턴스를 그대로 품는다.
 *
 * **노출 여부 prop이 없다.** 에러가 없으면 이 컴포넌트를 아예 렌더하지 않는 것이
 * 규칙이라(Figma 문서 `34385:15257`) `visible` 같은 boolean을 두지 않는다.
 *
 * 별표(*)도 고정이라 prop으로 빼지 않는다. `pl-4`는 심볼 자체의 `spacing/4`라
 * 소비처가 아니라 여기가 가진다 — 위 입력칸의 안쪽 글자와 세로줄을 맞춘다.
 *
 * `className`도 받지 않는다. 모양이 상위 컴포넌트마다 달라지면 "입력 계열이
 * 공통으로 쓰는 하나의 피드백"이라는 전제가 깨진다 — 배치는 부모가 자기 레이아웃
 * 으로 정한다.
 *
 * 별표와 문구가 각각 `Text`인 이유는 둘 사이 4px을 flex gap으로 줘야 해서다
 * (Figma도 텍스트 노드 두 개다). 레이아웃은 바깥 `div`가, 타이포·색은 `Text`가
 * 가진다.
 */
export const ErrorMessage = ({ message }: IErrorMessageProps) => (
  <div className="flex items-start gap-1 pl-4">
    <Text variant="caption-1" color="status-main-negative">
      *
    </Text>
    <Text variant="caption-1" color="status-main-negative">
      {message}
    </Text>
  </div>
);
