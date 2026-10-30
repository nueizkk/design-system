import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "..";

const meta: Meta<typeof Card> = {
  title: "components/Card",
  component: Card,
};

export default meta;

type Story = StoryObj<typeof Card>;

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 480, paddingTop: 40 }}>
      <Card size="sm">sm content</Card>
      <Card size="lg">lg content</Card>
    </div>
  ),
};
