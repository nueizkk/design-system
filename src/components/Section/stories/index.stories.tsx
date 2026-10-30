import type { Meta, StoryObj } from "@storybook/react-vite";

import { Section } from "..";

const meta: Meta<typeof Section> = {
  title: "components/Section",
  component: Section,
};

export default meta;

type Story = StoryObj<typeof Section>;

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 480, paddingTop: 40 }}>
      <Section size="sm">sm content</Section>
      <Section size="lg">lg content</Section>
    </div>
  ),
};
