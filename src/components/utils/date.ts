/**
 * 날짜 표시·파싱의 기본 형식.
 *
 * `Calendar`·`DateInput`·`DateFilter`·공지 목록이 모두 이 모양을 쓰는데 각자
 * 문자열로 적고 있었다. 한 군데서만 바꾸면 되도록 모아둔다.
 *
 * 사용자가 입력창에 보게 되는 안내 문구(`year_month_date`)와는 다른 것이다 —
 * 그쪽은 로케일마다 번역될 수 있는 문구고, 이것은 dayjs에 넘기는 형식 토큰이다.
 */
export const DATE_FORMAT = 'YYYY-MM-DD';
