/**
 * 레이어 순서 (전역 스태킹 전용)
 *
 * 1000부터 시작하는 것은 소비앱이 콘텐츠에 쓰는 z-1~z-10 위에 확실히 올라가기
 * 위함이고, 100 간격은 나중에 레이어를 끼워 넣을 자리다.
 *
 * 컴포넌트 **내부** 사다리(Sidebar 로고, Table sticky 셀처럼 부모 스태킹
 * 컨텍스트 안에서만 비교되는 것)는 여기에 넣지 않는다 — z-10 같은 로컬 값으로
 * 둔다. 숫자가 크다고 조상 밖으로 나가지 않는다.
 *
 * 순서 근거는 "무엇이 무엇 위에서 눌려야 하는가"다. popover가 modal보다 위인
 * 것은 모달 안의 셀렉트가 열려야 하기 때문이고, tooltip이 그 위인 것은 popover
 * 안의 아이콘에도 툴팁이 붙기 때문이다. toast는 무엇이 열려 있든 보여야 한다.
 */
export const zIndex = {
  sidebar: "1000",
  header: "1100",
  loading: "1200",
  backdrop: "1300",
  drawer: "1400",
  modal: "1500",
  popover: "1600",
  tooltip: "1700",
  toast: "1800",
};

export type TokenZIndexType = keyof typeof zIndex;
