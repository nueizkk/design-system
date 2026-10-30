/**
 * 타입 레벨 회귀 테스트. 실행되지 않고 `tsc --noEmit`으로만 검증된다.
 *
 * `@ts-expect-error`는 에러가 **나지 않으면** 반대로 컴파일을 깨뜨린다.
 * 즉 아래 prop들이 되살아나면 그 순간 빌드가 실패한다.
 */
import { Text } from '.';

/** 정상 사용 */
export const valid = (
  <Text as="h2" variant="subtitle-1" weight="bold" color="label-normal">
    제목
  </Text>
);

/** 레이아웃은 부모가 결정한다 — 정렬은 Text의 prop이 아니다 */
// @ts-expect-error
export const aligned = <Text align="center">정렬</Text>;

/** 밑줄은 className="hover:underline"로 쓴다 */
// @ts-expect-error
export const underlined = <Text underlineOnHover>밑줄</Text>;

/** 색 prop은 아이콘과 동일하게 color로 통일했다 */
// @ts-expect-error
export const filled = <Text fillColor="label-normal">색</Text>;

/** variant는 시각 스케일만 정한다 — 규정 외 값은 막힌다 */
// @ts-expect-error
export const badVariant = <Text variant="h1">큰 글씨</Text>;
