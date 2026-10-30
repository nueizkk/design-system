import { ReactNode, useEffect, useState } from "react";

import DrawerComponent from "react-modern-drawer";

import { zIndex } from "tokens";
import "./style.css";

import { Dim } from "../Dim";

import { DrawerBody } from "./Body";
import { DrawerProvider } from "./context";
import { DrawerFooter } from "./Footer";
import { DrawerHeader } from "./Header";

interface IDrawerProps {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
}

// react-modern-drawer의 슬라이드 애니메이션 길이(기본값과 동일). 닫힘 애니메이션이
// 끝나기 전에 children을 언마운트하면 내용만 먼저 사라지는 것처럼 보여서, 이 시간만큼
// 마운트를 유지했다가 언마운트한다 — Dropdown의 `isActive: boolean | 'closing'` 패턴과 동일한 이유.
const DRAWER_DURATION = 500;

function DrawerRoot({ isOpen, children, onClose }: IDrawerProps) {
  const [isMounted, setIsMounted] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      return;
    }

    const timer = setTimeout(() => setIsMounted(false), DRAWER_DURATION);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <>
      {/**
        * 라이브러리 오버레이를 끄고 공용 `Dim`을 쓴다. 전에는 라이브러리 것에 색만
        * 덮어썼는데(`!bg-material-dim !opacity-100`), 그러면 같은 딤이 Modal과
        * 다른 방식으로 그려진다. 스크롤 잠금도 `Dim`이 맡는다.
        */}
      {isOpen && <Dim onClick={onClose} />}
      <DrawerComponent
        open={isOpen}
        onClose={onClose}
        direction="right"
        size="480px"
        duration={DRAWER_DURATION}
        zIndex={Number(zIndex.drawer)}
        enableOverlay={false}
        className="!bg-background-normal !shadow-none"
      >
        {isMounted && (
          <DrawerProvider onClose={onClose}>
            <div className="flex h-full flex-col px-12 py-10">{children}</div>
          </DrawerProvider>
        )}
      </DrawerComponent>
    </>
  );
}

export const Drawer = Object.assign(DrawerRoot, {
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
});

export default Drawer;
