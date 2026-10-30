import { Fragment, HTMLAttributes, MouseEvent, ReactNode, useRef } from 'react';

import * as Icon from '../../icons';
import { Text } from '../Text';

export type InfoItemType = {
  label: string;
  /**
   * 텍스트 외의 표현(`Status`·메모 등)은 호출부가 조립해 넘긴다 — Figma의
   * `value` 축을 코드에서 재현하지 않고 슬롯으로 연다.
   */
  value: ReactNode;
  /**
   * 값 오른쪽에 복사 아이콘을 띄운다. **무엇을 복사할지는 받지 않는다** —
   * 렌더된 글자를 그대로 읽으므로 `value`가 어떤 노드든 보이는 대로 복사된다.
   *
   * `value`가 슬롯인데 복사만 축으로 둔 이유는 성격이 달라서다. `Status`는
   * **무엇을 그릴지**(도메인)라 밖에서 와야 하지만, 복사는 **이미 그려진 것으로
   * 무엇을 할지**(동작)다. `Table`의 셀도 같은 선을 긋는다.
   */
  copy?: boolean;
  /** 복사 완료 안내는 호출부 몫이다 — 여기서 토스트를 띄우면 된다. */
  onCopy?: (text: string) => void;
};

/**
 * `className`을 뺀다 — 시각 스펙을 밖에서 덮는 통로라 Figma 완전싱크와 충돌한다.
 * `Input`·`Textarea`·`Checkbox`·`Chip`도 같은 방식으로 막았다.
 *
 * 다만 소비앱이 넘기던 30건은 **전부 레이아웃이었다**(`flex-1`·`w-1/2`·`items-center`·
 * `gap-y-2`). 색·테두리·타이포를 덮는 건 하나도 없었다. 감싸는 쪽에서 주면 되지만,
 * 레이아웃 주입을 다시 열어야 한다는 얘기가 나오면 이 사실을 먼저 보라.
 */
interface IInfoProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  items: InfoItemType[];
}

/**
 * 항목 하나의 값 칸. 복사 대상 글자를 읽으려면 **항목마다 ref가 따로** 있어야
 * 해서 컴포넌트로 뗐다.
 */
function InfoValue({ value, copy, onCopy }: Omit<InfoItemType, 'label'>) {
  const valueRef = useRef<HTMLElement>(null);

  const handleCopy = async (event: MouseEvent<SVGSVGElement>) => {
    /** 값 칸 바깥(행 클릭 등)까지 번지지 않게 막는다. */
    event.stopPropagation();

    const text = valueRef.current?.textContent ?? '';
    await navigator.clipboard.writeText(text);
    onCopy?.(text);
  };

  if (!copy) {
    return (
      <Text variant="body-2" className="whitespace-nowrap">
        {value}
      </Text>
    );
  }

  /** Figma `37449:21`: 값과 아이콘 사이 4px, 아이콘 16px. */
  return (
    <div className="flex min-w-0 items-center gap-1">
      <Text ref={valueRef} variant="body-2" className="truncate">
        {value}
      </Text>
      <Icon.Copy
        size="sm"
        cursor="pointer"
        color="label-assistive"
        className="shrink-0"
        onClick={handleCopy}
      />
    </div>
  );
}

export const Info = ({ items, ...props }: IInfoProps) => {
  return (
    <div
      className="grid h-fit grid-cols-[101px,1fr] items-start gap-x-8 gap-y-4"
      {...props}
    >
      {items.map((item) => (
        <Fragment key={item.label}>
          <Text
            variant="body-2"
            weight="semibold"
            color="label-assistive"
            className="break-words"
          >
            {item.label}
          </Text>
          <InfoValue
            value={item.value}
            copy={item.copy}
            onCopy={item.onCopy}
          />
        </Fragment>
      ))}
    </div>
  );
};
