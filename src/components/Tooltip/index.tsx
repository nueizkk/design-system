import { ReactNode } from 'react';

import { Popover } from '../Popover';
import PopoverTrigger from '../Popover/Trigger';
import { SideType } from '../Popover/Portal';
import { Text } from '../Text';
import { cn } from '../utils/cn';

export type TooltipTrigger = 'hover' | 'click';

export interface ITooltipProps {
  label: string;
  /** 트리거의 위/아래 중 어디에 뜰지. `Popover`의 같은 축과 이름을 맞춘다. */
  side?: SideType;
  /**
   * 무엇으로 띄울지. `hover`가 기본이다.
   *
   * `click`은 눌러서 토글하고 바깥을 누르면 닫힌다 — 손가락으로 쓰는 화면처럼
   * hover가 없는 환경이나, 읽는 데 시간이 걸리는 안내에 쓴다.
   */
  trigger?: TooltipTrigger;
  /** 트리거가 부모 폭을 꽉 채우게 한다. 말줄임되는 표 셀에 필요하다. */
  fullWidth?: boolean;
  /** 툴팁을 띄울 대상. `Tooltip.Trigger`로 감싼다. */
  children: ReactNode;
}

/**
 * 꼬리: 12×12 정사각형을 45도 돌려 절반만 내보낸다 → 돌출 높이 = 6√2.
 *
 * 패널 컨테이너가 이미 4px(`pt-1`/`pb-1`)을 띄워주므로, 꼬리가 트리거를 덮지
 * 않도록 그 높이만큼을 말풍선 바깥에 더 확보한다.
 */
const TAIL_VISIBLE_HEIGHT = 6 * Math.sqrt(2);

function TooltipRoot({
  label,
  side = 'top',
  trigger = 'hover',
  fullWidth = false,
  children,
}: ITooltipProps) {
  return (
    /**
     * 위치 계산·포탈·리사이즈/스크롤 추적을 `Popover`가 맡는다. 전에는 툴팁이
     * `absolute`라 조상의 `overflow-hidden`에 잘렸고(표 셀이 그렇다), 호출부가
     * `position: relative` 상자를 만들어줘야 하는 암묵적 계약도 있었다.
     *
     * `align="center"`라야 꼬리가 트리거 중앙을 가리킨다.
     */
    <Popover
      openOnHover={trigger === 'hover'}
      fullWidth={fullWidth}
      align="center"
      side={side}
    >
      {children}
      <div
        style={{
          [side === 'top' ? 'paddingBottom' : 'paddingTop']:
            TAIL_VISIBLE_HEIGHT,
        }}
      >
        {/**
          * `break-words`가 없으면 띄어쓰기 없는 긴 값(해시·소수점 18자리 수량)이
          * 한 덩어리로 취급돼 280px을 넘어 삐져나간다. 들어갈 자리가 없을 때만
          * 글자 단위로 끊어 다음 줄로 내린다.
          */}
        {/**
          * `flex`인 이유 — `Text`는 기본이 `span`(인라인)이라 블록 부모 안에서는
          * 줄상자가 글꼴 메트릭만큼 더 높아진다. 한 줄 높이가 20+4+4=28이 아니라
          * 32가 됐던 원인이다. flex 아이템이 되면 그 여백이 사라진다.
          */}
        <div className="bg-label-normal shadow-200 relative flex w-max max-w-[280px] break-words rounded-sm px-2 py-1">
          <div
            className={cn(
              'bg-label-normal rounded-br-2xs rounded-tl-2xs absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45',
              side === 'top'
                ? 'top-full -translate-y-1/2'
                : 'bottom-full translate-y-1/2',
            )}
          />
          <Text className="relative" variant="body-2" color="background-normal">
            {label}
          </Text>
        </div>
      </div>
    </Popover>
  );
}

export const Tooltip = Object.assign(TooltipRoot, { Trigger: PopoverTrigger });

export default Tooltip;
