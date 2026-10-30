import type { Meta, StoryObj } from "@storybook/react-vite";

import { Logo } from "..";

const meta: Meta<typeof Logo> = {
  title: "components/Logo",
  component: Logo,
};

export default meta;

type Story = StoryObj<typeof Logo>;

export const Basic: Story = {
  args: { type: "basic" },
};

export const White: Story = {
  args: { type: "white" },
  render: (args) => (
    <div style={{ background: "#222222", padding: 16 }}>
      <Logo {...args} />
    </div>
  ),
};
