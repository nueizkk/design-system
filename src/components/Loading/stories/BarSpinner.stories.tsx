import type { Meta, StoryObj } from "@storybook/react-vite";

import { BarSpinner } from "../BarSpinner";

const meta: Meta<typeof BarSpinner> = {
  title: "components/Loading/BarSpinner",
  component: BarSpinner,
};

export default meta;

type Story = StoryObj<typeof BarSpinner>;

export const Default: Story = {};
