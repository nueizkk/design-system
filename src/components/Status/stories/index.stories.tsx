import type { Meta, StoryObj } from "@storybook/react-vite";

import { Status } from "..";

const meta: Meta<typeof Status> = {
  title: "components/Status",
  component: Status,
};

export default meta;

type Story = StoryObj<typeof Status>;

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, paddingTop: 40 }}>
      <Status type="positive" label="text" />
      <Status type="ongoing" label="text" />
      <Status type="off" label="text" />
      <Status type="cautionary" label="text" />
      <Status type="negative" label="text" />
    </div>
  ),
};
