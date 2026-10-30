import type { ReactNode } from 'react';

interface ITokenTableProps<T> {
  tokens: Record<string, T>;
  /** 값 칸 문자열. 객체 토큰(typography 등)은 직접 포맷한다. */
  format?: (value: T) => string;
  preview: (value: T, name: string) => ReactNode;
}

/**
 * 토큰 스토리 공통 표. 토큰마다 미리보기 모양만 다르고 `이름 · 값 · 미리보기`
 * 구조는 같아서 여기 한 번만 적는다.
 *
 * 글자·선 색은 DS 시맨틱 클래스를 그대로 쓴다 — Storybook Backgrounds를 dark로
 * 바꾸면 표 자체도 같이 따라가고, 토큰 갤러리가 토큰을 안 쓰는 모순도 없다.
 */
export const TokenTable = <T,>({
  tokens,
  format = String,
  preview,
}: ITokenTableProps<T>) => (
  <table className="text-label-normal w-full border-collapse text-left font-mono text-xs">
    <thead className="text-label-alternative">
      <tr>
        <th className="border-line-normal border-b py-2 pr-6 font-normal">
          name
        </th>
        <th className="border-line-normal border-b py-2 pr-6 font-normal">
          value
        </th>
        <th className="border-line-normal w-full border-b py-2 font-normal">
          preview
        </th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(tokens).map(([name, value]) => (
        <tr key={name}>
          <td className="border-line-normal whitespace-nowrap border-b py-2 pr-6 align-middle">
            {name}
          </td>
          <td className="border-line-normal text-label-neutral whitespace-pre border-b py-2 pr-6 align-middle">
            {format(value as T)}
          </td>
          <td className="border-line-normal border-b py-2 align-middle">
            {preview(value as T, name)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
