import type { Meta, StoryObj } from "@storybook/react-vite";

import { TailSpinner } from "../TailSpinner";

const meta: Meta<typeof TailSpinner> = {
  title: "components/Loading/TailSpinner",
  component: TailSpinner,
};

export default meta;

type Story = StoryObj<typeof TailSpinner>;

export const AllColors: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, padding: 16, background: "#888888" }}>
      <TailSpinner color="primary" size="lg" />
      <TailSpinner color="white" size="lg" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, background: "#888888" }}>
      <TailSpinner color="white" size="md" />
      <TailSpinner color="white" size="lg" />
    </div>
  ),
};
