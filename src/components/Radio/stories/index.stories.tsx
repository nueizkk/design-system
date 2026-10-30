import type { Meta, StoryObj } from "@storybook/react-vite";

import { Radio } from "..";

const meta: Meta<typeof Radio> = {
  title: "components/Radio",
  component: Radio,
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, paddingTop: 40 }}>
      <Radio name="story-radio-1" value="1" defaultChecked={false} />
      <Radio name="story-radio-1" value="2" defaultChecked={true} />
      <Radio name="story-radio-1" value="3" disabled />
    </div>
  ),
};
