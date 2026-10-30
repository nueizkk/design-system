import { useEffect } from "react";

import type { Preview } from "@storybook/react-vite";

import "../src/styles/global.css";

// 시맨틱 컬러의 다크 값은 `.dark:root` 선택자로만 켜지므로(src/tailwind.ts),
// Storybook 기본 Backgrounds 툴바에서 dark를 고르면 <html>에 dark 클래스를
// 실제로 붙여줘야 다크 토큰이 반영된다.
const useSyncDarkClass = (backgroundValue: unknown) => {
  const key =
    typeof backgroundValue === "string"
      ? backgroundValue
      : (backgroundValue as { value?: string } | undefined)?.value;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", key === "dark");
  }, [key]);
};

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        light: { name: "light", value: "#ffffff" },
        dark: { name: "dark", value: "#222222" },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: "light" },
  },
  decorators: [
    (Story, context) => {
      useSyncDarkClass(context.globals.backgrounds);

      return <Story />;
    },
  ],
};

export default preview;
