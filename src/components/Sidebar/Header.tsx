import { SidebarVariantType } from "./config";
import { Logo } from "../Logo";
import * as Icon from "../../icons";
import { cn } from "../utils/cn";

interface ISidebarHeaderProps {
  variant: SidebarVariantType;
  open: boolean;
  onToggle: () => void;
}

function SidebarHeader({ variant, open, onToggle }: ISidebarHeaderProps) {
  const ToggleIcon = open ? Icon.SidebarClose : Icon.SidebarOpen;

  return (
    <div
      className={cn(
        "relative z-10 flex w-full items-center px-4",
        /** 접히면 로고가 폭 0으로 줄어드는 동안 토글이 가운데에 서야 한다. */
        open ? "justify-between" : "justify-center",
      )}
    >
      <div
        className={cn(
          "min-h-[20px] min-w-[124px] overflow-hidden transition-[opacity,width,min-width] duration-300",
          !open && "w-0 min-w-0 opacity-0",
        )}
        data-testid="sidebarHeaderLogo"
      >
        <Logo type={variant === "primary" ? "white" : "basic"} />
      </div>
      <ToggleIcon
        data-testid={open ? "sidebarHide" : "sidebarOpen"}
        onClick={onToggle}
        color={variant === "primary" ? "static-white" : "label-alternative"}
        cursor="pointer"
      />
    </div>
  );
}

export default SidebarHeader;
