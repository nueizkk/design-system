import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Drawer } from "..";
import { Button } from "../../Button";

const meta: Meta<typeof Drawer> = {
  title: "components/Drawer",
  component: Drawer,
};

export default meta;

type Story = StoryObj<typeof Drawer>;

type OpenVariant = "long" | "short" | "noFooter" | null;

const LongContent = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {Array.from({ length: 40 }, (_, idx) => (
      <div key={idx}>본문 콘텐츠 {idx + 1}</div>
    ))}
  </div>
);

const AllVariantsDemo = () => {
  const [openVariant, setOpenVariant] = useState<OpenVariant>(null);
  const close = () => setOpenVariant(null);

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button size="sm" onClick={() => setOpenVariant("long")}>
        긴 콘텐츠(스크롤 있음)
      </Button>
      <Button size="sm" onClick={() => setOpenVariant("short")}>
        짧은 콘텐츠(스크롤 없음)
      </Button>
      <Button size="sm" onClick={() => setOpenVariant("noFooter")}>
        Footer 없음
      </Button>

      <Drawer isOpen={openVariant === "long"} onClose={close}>
        <Drawer.Header title="상세 정보" subTitle="선택한 항목의 상세 내역입니다" />
        <Drawer.Body>
          <LongContent />
        </Drawer.Body>
        <Drawer.Footer>
          <Button size="lg" fullWidth onClick={close}>
            저장
          </Button>
        </Drawer.Footer>
      </Drawer>

      <Drawer isOpen={openVariant === "short"} onClose={close}>
        <Drawer.Header title="상세 정보" subTitle="선택한 항목의 상세 내역입니다" />
        <Drawer.Body>본문 콘텐츠가 짧아서 스크롤이 생기지 않습니다.</Drawer.Body>
        <Drawer.Footer>
          <Button size="lg" fullWidth onClick={close}>
            저장
          </Button>
        </Drawer.Footer>
      </Drawer>

      <Drawer isOpen={openVariant === "noFooter"} onClose={close}>
        <Drawer.Header title="조회 전용" />
        <Drawer.Body>
          <LongContent />
        </Drawer.Body>
      </Drawer>
    </div>
  );
};

export const Default: Story = {
  render: () => <AllVariantsDemo />,
};
