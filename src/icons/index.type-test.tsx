/**
 * 타입 레벨 회귀 테스트. 실행되지 않고 `tsc --noEmit`으로만 검증된다.
 *
 * `@ts-expect-error`는 에러가 **나지 않으면** 반대로 컴파일을 깨뜨린다.
 * 즉 아래 오용들이 언젠가 조용히 통과하게 되면 그 순간 빌드가 실패한다.
 */
import * as Icon from '.';
/** default export를 두지 않는다 — 네임스페이스 import만 트리셰이킹된다 */
// @ts-expect-error
import DefaultIcon from '.';

/** 정상 사용 */
export const valid = <Icon.Star size="sm" color="label-normal" />;

/** 제거된 prop이 되살아나선 안 된다 */
// @ts-expect-error
export const removedProps = <Icon.Star fillColor="label-normal" />;
// @ts-expect-error
export const removedStop = <Icon.Star stopPropagation />;

/** 네임스페이스 자체는 컴포넌트가 아니다 */
// @ts-expect-error
export const asComponent = <Icon />;

/** 구 스프라이트 API(`id` prop)는 되살아나선 안 된다 */
// @ts-expect-error
export const spriteApi = <Icon id="star" />;

/** 존재하지 않는 아이콘 */
// @ts-expect-error
export const missing = <Icon.NotAnIcon />;

void DefaultIcon;
