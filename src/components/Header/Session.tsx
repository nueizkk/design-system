import { useCallback, useEffect, useRef, useState } from 'react';

import { getFormattedTime, getTimeUnitCount } from './config';
import { Text } from '../Text';
import { useStrings } from '../../i18n';

export interface IHeaderSession {
  /**
   * 세션이 끝나는 **시각**(ms, `Date.now()`와 같은 기준). 소비앱이 가진 값을
   * 그대로 넘긴다 — DS는 이게 어디서 온 값인지(쿠키·JWT 등) 알지 않는다.
   *
   * JWT `exp`는 초 단위라 `exp * 1000`으로 넘긴다.
   *
   * 연장했다면 새 값을 내려주면 된다. 값이 바뀌면 알림 지점도 함께 초기화된다.
   */
  expiresAt: number;
  /**
   * 서버의 현재 시각(ISO 문자열). 클라이언트 시계가 틀어져 있을 때 보정에 쓴다.
   * 없으면 클라이언트 시계를 그대로 믿는다.
   */
  serverTime?: string;
  /**
   * 만료 **몇 ms 전**부터 시간 글자를 경고색으로 바꿀지. 넘기지 않으면 색이
   * 변하지 않는다. 예: `5 * 60 * 1000`이면 5분 남은 시점부터.
   *
   * `expiresAt`과 달리 시각이 아니라 길이다 — `At`은 시각, `Before`는 길이.
   */
  warningBefore?: number;
  /**
   * 알림을 받을 지점들. 각 값은 만료 **몇 ms 전**인지를 뜻한다.
   * 예: `[30 * 60 * 1000, 5 * 60 * 1000]`이면 30분 전과 5분 전.
   *
   * 몇 분 전에 무엇을 안내할지는 서비스 정책이라 DS가 정하지 않는다. 전에는
   * 30분·10분·5분이 여기 박혀 있었다.
   */
  notifyBefore?: number[];
  /** `notifyBefore`의 한 지점을 지났을 때. 그 지점의 값(ms)을 그대로 돌려준다. */
  onReach?: (remainingMs: number) => void;
  /** 남은 시간이 0이 됐을 때. 카운트다운이 끝나는 건 정책이 아니라 타이머의 일이다. */
  onExpire?: () => void;
  onExtend: () => void;
}

/**
 * 헤더의 세션 자리(Figma `Header/Time` 29060:14924). 세션이 끝날 때까지 남은
 * 시간을 보여주고, 지정된 지점을 지날 때 알린다.
 *
 * 형제 칩들처럼 **그 자리가 대변하는 것**으로 이름을 짓는다 — `Profile`이 프로필
 * 데이터이듯 여기는 세션이다. 받는 값도 `expiresAt`·`onExtend`로 전부 세션
 * 사실이지 타이머 설정이 아니다.
 *
 * **정책은 전부 밖에서 온다.** 언제 알릴지(`notifyBefore`), 언제 경고색으로
 * 바꿀지(`warningBefore`), 그때 무엇을 할지는 소비앱이 정한다. 이 컴포넌트가 쥐는 것은
 * 시계 하나뿐이다 — 화면에 카운트다운을 그려야 해서 가지고 있는 것이고, 앱이
 * 따로 시계를 돌리면 둘이 어긋나기 때문이다.
 */
export default function Session({
  expiresAt,
  serverTime,
  warningBefore,
  notifyBefore,
  onReach,
  onExpire,
  onExtend,
}: IHeaderSession) {
  const strings = useStrings();

  /**
   * 자릿수는 처음 남은 시간으로 정하고 유지한다. 연장해서 `expiresAt`이 바뀌면
   * 그때 다시 정한다 — 3분 남았다가 1시간으로 늘면 시 자리가 필요해진다.
   */
  const unitCountRef = useRef(getTimeUnitCount(expiresAt - Date.now()));

  /** 서버 시각 = 클라이언트 시각 + offset */
  const offsetRef = useRef(0);
  const getNow = useCallback(() => Date.now() + offsetRef.current, []);

  useEffect(() => {
    if (!serverTime) return;
    offsetRef.current = new Date(serverTime).getTime() - Date.now();
  }, [serverTime]);

  /**
   * 이미 알린 지점들. 새로고침 직후나 연장 직후에 지나간 지점이 한꺼번에
   * 터지지 않도록, 직전 틱의 남은 시간과 비교해 "이번에 지났다"만 알린다.
   */
  const firedRef = useRef<Set<number>>(new Set());
  const expiredRef = useRef(false);
  const prevLeftRef = useRef<number | null>(null);

  /** 만료 시각이 바뀌면(=연장) 알림 상태를 처음으로 되돌린다. */
  useEffect(() => {
    const left = Math.max(0, expiresAt - getNow());
    unitCountRef.current = getTimeUnitCount(left);
    firedRef.current = new Set();
    expiredRef.current = false;
    prevLeftRef.current = left;
  }, [expiresAt, getNow]);

  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      const left = Math.max(0, expiresAt - getNow());
      const prev = prevLeftRef.current;

      if (prev !== null) {
        notifyBefore?.forEach((point) => {
          if (firedRef.current.has(point)) return;
          if (prev > point && left <= point) {
            firedRef.current.add(point);
            onReach?.(point);
          }
        });

        if (!expiredRef.current && prev > 0 && left <= 0) {
          expiredRef.current = true;
          onExpire?.();
        }
      }

      prevLeftRef.current = left;
      tick((n) => (n + 1) % 2);
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt, getNow, notifyBefore, onReach, onExpire]);

  const leftMs = Math.max(0, expiresAt - getNow());
  const isWarning = warningBefore !== undefined && leftMs < warningBefore;

  return (
    /**
     * Figma `Header/Time`은 h-32 · gap-8이고 구분선은 h-12 · w-1이다. 폭은
     * 내용에 맞춘다 — 변형 하나에만 `w-91`이 있었고 그 값도 내용물 폭과 같았다.
     *
     * 구분선은 직접 그린다 — Figma에 구분선 컴포넌트가 없고, 레포의 다른 구분선들도
     * 전부 이렇게 그린다. 높이를 `h-3`으로 박는 이유는 부모(32)를 따라가면 26이 되어
     * 길어지기 때문이다.
     *
     * 경고 상태에서 색이 바뀌는 건 시간 글자뿐이다. "연장"은 그대로 둔다.
     */
    <div className="flex h-8 items-center gap-2">
      <Text
        variant="caption-1"
        color={isWarning ? 'status-main-negative' : 'label-normal'}
      >
        {getFormattedTime(leftMs, unitCountRef.current)}
      </Text>
      <div className="bg-line-normal h-3 min-w-[1px] self-center" />
      <Text variant="caption-1" onClick={onExtend} className="cursor-pointer">
        {strings['extend']}
      </Text>
    </div>
  );
}
