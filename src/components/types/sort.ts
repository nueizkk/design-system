/**
 * 정렬 상태. `Table`과 `SimpleTable`이 같은 모양을 쓰므로 한쪽에 두지 않고
 * 공용 타입으로 둔다 — 둘이 합쳐지면 그쪽으로 옮긴다.
 */
export interface ISort<T extends string> {
  id: T;
  desc: boolean;
}
