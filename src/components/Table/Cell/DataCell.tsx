import { MouseEvent, ReactNode, useRef } from "react";

import * as Icon from "../../../icons";
import { Text } from "../../Text";
import { Tooltip } from "../../Tooltip";
import { cn } from "../../utils/cn";
import { CellAlignType } from "../types";
import { useTruncated } from "./useTruncated";

export interface IDataCellProps {
  /**
   * 화면에 그릴 값. 문자열이 아니어도 된다 — 툴팁·복사에 쓸 글자는 **그려진
   * 결과에서 `textContent`로 뽑아내므로** 태그가 섞여 있어도 동작한다.
   */
  children: ReactNode;
  align?: CellAlignType;
  /** 값 앞에 붙는 분류. `'일반'`을 넘기면 `[일반]`으로 그린다 — 괄호는 DS가 붙인다. */
  category?: string;
  /** 값 뒤에 붙는 자산 단위. `'ETH'`처럼 넘긴다. */
  currency?: string;
  /**
   * 줄 맨 뒤에 복사 아이콘을 붙인다(단위가 있으면 그 뒤). 누르면 **값만**
   * 클립보드에 들어간다 — 붙여넣을 때 분류·단위가 섞이면 안 된다.
   *
   * 복사 완료 안내는 호출부 몫이다 — `onCopy`에서 토스트를 띄우면 된다. 라이브러리가
   * 띄우려면 `<ToastContainer />`가 깔려 있어야 하는데, 표가 자기 바깥의 마운트
   * 상태에 기대게 된다.
   */
  copy?: boolean;
  onCopy?: (text: string) => void;
  /**
   * `'always'`면 잘리지 않아도 툴팁을 띄운다. 기본은 **말줄임이 생길 때만**이다.
   * 소수점이 긴 수량처럼 원본을 늘 확인해야 하는 칸에 쓴다.
   */
  tooltip?: "always";
}

const ALIGN: Record<CellAlignType, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

/**
 * 데이터 한 칸(Figma `DataCell` 21427:5522).
 *
 * 한 줄에 최대 네 조각이 4px 간격으로 선다 — `[분류] 값 [복사] [단위]`. 패딩은
 * 없다. 칸의 여백은 행(`Data`)이 정한다.
 *
 * **말줄임은 값에만 건다.** 분류·복사·단위는 줄어들지 않고(`shrink-0`) 값만 줄어든다.
 */
export function DataCell({
  children,
  align = "left",
  category,
  currency,
  copy,
  onCopy,
  tooltip,
}: IDataCellProps) {
  const valueRef = useRef<HTMLElement>(null);
  const isTruncated = useTruncated(valueRef);

  /** 복사에 쓰는 글자. **값만** 넣는다 — 붙여넣을 때 분류·단위가 섞이면 안 된다. */
  const getValueText = () => valueRef.current?.textContent ?? "";

  /**
   * 툴팁에 쓰는 글자. 화면에 보이는 그대로 **분류·단위까지** 한 칸 띄어 잇는다
   * (`[일반] 1,234.5678 ETH`). 잘린 칸에서 hover 했을 때 보이던 것이 온전히
   * 드러나야 하기 때문이다. 복사 아이콘은 글자가 아니라 들어가지 않는다.
   */
  const getTooltipText = () =>
    [category && `[${category}]`, getValueText(), currency]
      .filter(Boolean)
      .join(" ");

  /**
   * 복사는 셀 안에서 끝나는 동작이라 전파를 막는다. 안 막으면 행 클릭까지 함께
   * 터져서, 값을 복사하려다 상세 페이지로 넘어간다.
   */
  const handleCopy = async (event: MouseEvent<SVGSVGElement>) => {
    event.stopPropagation();

    const text = getValueText();
    await navigator.clipboard.writeText(text);
    onCopy?.(text);
  };

  /**
   * 말줄임이 걸리려면 `overflow-hidden`이 **잘리는 상자** 쪽에 있어야 한다. 그래서
   * 값은 항상 이 span이 감싼다 — `children`이 무엇이든 폭·말줄임·타이포가 보장된다.
   */
  const value = (
    <Text ref={valueRef} variant="body-2" className="block min-w-0 truncate">
      {children}
    </Text>
  );

  const content = (
    <div className={cn("flex min-w-0 items-center gap-1", ALIGN[align])}>
      {category && (
        <Text variant="body-2" weight="bold" className="shrink-0">
          {`[${category}]`}
        </Text>
      )}

      {value}

      {currency && (
        <Text
          variant="caption-1"
          color="label-alternative"
          className="shrink-0"
        >
          {currency}
        </Text>
      )}

      {copy && (
        <Icon.Copy
          size="sm"
          cursor="pointer"
          /** 값보다 한 단계 연하다 — 글자가 주인공이고 복사는 보조다(Figma DataCell). */
          color="label-alternative"
          className="shrink-0"
          onClick={handleCopy}
        />
      )}
    </div>
  );

  /**
   * 툴팁은 **칸 전체**가 받는다 — 분류부터 복사 아이콘까지 어디에 올려도 뜬다.
   * 값에만 걸면 잘린 숫자 위에서만 떠서, 바로 옆 단위에 올리면 사라진다.
   */
  if (tooltip !== "always" && !isTruncated) return content;

  return (
    <Tooltip label={getTooltipText()} fullWidth>
      <Tooltip.Trigger>{content}</Tooltip.Trigger>
    </Tooltip>
  );
}

export default DataCell;
