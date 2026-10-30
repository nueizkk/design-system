import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "..";

const meta: Meta<typeof Checkbox> = {
  title: "components/Checkbox",
  component: Checkbox,
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, paddingTop: 40 }}>
      <Checkbox defaultChecked={false} />
      <Checkbox defaultChecked={true} />
      <Checkbox checked="partial" />
      <Checkbox disabled />
    </div>
  ),
};
