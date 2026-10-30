import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toggle } from "..";

const meta: Meta<typeof Toggle> = {
  title: "components/Toggle",
  component: Toggle,
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Toggle />
      <Toggle defaultChecked />
      <Toggle disabled />
      <Toggle defaultChecked disabled />
    </div>
  ),
};
