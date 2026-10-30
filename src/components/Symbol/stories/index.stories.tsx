import type { Meta, StoryObj } from "@storybook/react-vite";

import { Symbol, SymbolSizeType } from "..";

const meta: Meta<typeof Symbol> = {
  title: "components/Symbol",
  component: Symbol,
};

export default meta;

type Story = StoryObj<typeof Symbol>;

const SIZES: SymbolSizeType[] = ["md", "lg", "xl"];

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
      {SIZES.map((size) => (
        <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Symbol size={size} />
          <span style={{ fontSize: 12, color: "#888" }}>{size}</span>
        </div>
      ))}
    </div>
  ),
};
