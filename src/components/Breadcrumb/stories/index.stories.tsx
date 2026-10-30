import type { Meta, StoryObj } from "@storybook/react-vite";

import { Breadcrumb } from "..";

const meta: Meta<typeof Breadcrumb> = {
  title: "components/Breadcrumb",
  component: Breadcrumb,
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Multiple: Story = {
  args: {
    items: ["출금 관리", "출금 관리 상세", "요청 내역"],
  },
};

export const Single: Story = {
  args: {
    items: ["대시보드"],
  },
};
