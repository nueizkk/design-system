import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

import { zIndex } from '../zIndex';

const SRC = join(__dirname, '../..');

/**
 * 전역 레이어는 tokens/zIndex의 이름으로만 쓴다. 임의값이 하나 끼어들면 "남의
 * 값을 이기려고 숫자를 올리는" 패턴이 다시 시작되므로 여기서 막는다.
 *
 * 허용 목록은 **컴포넌트 내부 사다리**다 — absolute/relative 부모 안에서만
 * 비교되므로 전역 토큰을 쓸 이유가 없고, 써서도 안 된다.
 */
const ALLOWED_LOCAL = ['components/Sidebar/Logo.tsx'];

const collect = (dir: string, acc: string[] = []): string[] => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collect(full, acc);
    else if (/\.tsx?$/.test(entry.name) && !/\.(test|stories)\.tsx?$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
};

const offenders = (pattern: RegExp) =>
  collect(SRC)
    .filter((f) => !ALLOWED_LOCAL.some((a) => f.endsWith(a)))
    .flatMap((f) =>
      readFileSync(f, 'utf8')
        .split('\n')
        .map((line, i) => ({ line: line.trim(), no: i + 1, f }))
        .filter(({ line }) => pattern.test(line))
        .map(({ f: file, no, line }) => `${file.replace(SRC, 'src')}:${no}  ${line}`),
    );

describe('z-index', () => {
  it('임의값 z-[...] 대신 레이어 토큰을 쓴다', () => {
    expect(offenders(/\bz-\[\d+\]/)).toEqual([]);
  });

  it('zIndex prop에 숫자를 직접 쓰지 않는다', () => {
    expect(offenders(/zIndex[=:]\s*\{?\s*\d/)).toEqual([]);
  });

  it('레이어 순서가 조밀하지 않다 — 끼워 넣을 간격이 있다', () => {
    const values = Object.values(zIndex).map(Number);
    const sorted = [...values].sort((a, b) => a - b);
    expect(values).toEqual(sorted);
    sorted.slice(1).forEach((v, i) => expect(v - sorted[i]).toBeGreaterThanOrEqual(100));
  });
});
