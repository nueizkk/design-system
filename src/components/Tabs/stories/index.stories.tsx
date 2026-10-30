import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs } from "..";

const meta: Meta<typeof Tabs> = {
  title: "components/Tabs",
  component: Tabs,
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const TabsDemo = () => {
  const [active, setActive] = useState(0);
  const labels = ["대기중", "진행중 차단 (13)", "완료", "이 라벨은 150px를 훌쩍 넘겨서 말줄임표로 잘려야 하는 아주 긴 텍스트입니다"];

  return (
    <Tabs
      items={labels.map((label, idx) => ({
        label,
        active: idx === active,
        onClick: () => setActive(idx),
      }))}
    />
  );
};

export const Default: Story = {
  render: () => <TabsDemo />,
};
