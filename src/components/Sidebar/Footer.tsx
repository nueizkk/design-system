import { useState } from "react";

import { Text } from "../Text";
import { cn } from "../utils/cn";

export interface ISidebarFooter {
  companyName: string;
  /** 회사 로고 이미지 URL. 조립은 소비앱이 한다. */
  logoUrl?: string;
}

interface ISidebarFooterProps extends ISidebarFooter {
  open: boolean;
}

/**
 * 사이드바 하단의 회사 정보(Figma `2867:33191`). 접히면 이름이 빠지고 로고만
 * 남는다(Figma `16723:30714`).
 *
 * 로고 가로 위치는 `px-4`로 둔다. Figma는 펼침 푸터에 `pl-14`를 주는데, 그러면
 * 접힘(중앙 정렬 → 36px)과 2px 어긋나고 펼침에서도 메뉴 아이콘(36px)보다 2px
 * 왼쪽이라 세로 줄이 맞지 않는다. 16px로 두면 셋이 모두 36px에 선다.
 */
function SidebarFooter({ companyName, logoUrl, open }: ISidebarFooterProps) {
  /** 로고 URL이 404여도 깨진 이미지 아이콘이 뜨지 않도록 머리글자로 대체한다. */
  const [isLogoBroken, setLogoBroken] = useState(false);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center overflow-hidden",
        open ? "w-[220px] gap-3.5 px-4" : "h-6 w-[64px] justify-center",
      )}
    >
      {logoUrl && !isLogoBroken ? (
        <img
          src={logoUrl}
          alt=""
          className="size-6 shrink-0 rounded-full object-cover"
          onError={() => setLogoBroken(true)}
        />
      ) : (
        <div className="bg-line-neutral flex size-6 shrink-0 items-center justify-center rounded-full">
          <Text variant="caption-1" weight="bold" color="static-white">
            {companyName[0]}
          </Text>
        </div>
      )}
      {open && (
        <Text variant="body-2" color="label-alternative" className="truncate">
          {companyName}
        </Text>
      )}
    </div>
  );
}

export default SidebarFooter;
