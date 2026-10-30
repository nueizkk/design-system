import type { Meta, StoryObj } from "@storybook/react-vite";

import { Option } from "..";
import * as Icon from '../../../icons';

const meta: Meta<typeof Option> = {
  title: "components/Option",
  component: Option,
};

export default meta;

type Story = StoryObj<typeof Option>;

const sizes = ["xs", "sm", "md", "lg"] as const;

export const AllSizesAndStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32, paddingTop: 40 }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span>{size}</span>
          <Option size={size} value="a" label="list" leftIcon={Icon.CircleCheck} />
          <Option size={size} value="b" label="list" leftIcon={Icon.CircleCheck} active />
          <Option size={size} value="c" label="list" leftIcon={Icon.CircleCheck} disabled />
          {size === "xs" && <Option size="xs" value="d" label="list" leftIcon={Icon.CircleCheck} negative />}
        </div>
      ))}
    </div>
  ),
};

/**
 * `indent`는 아이콘 한 칸만큼 빈 자리를 만든다. 아이콘이 있는 형제와 글자
 * 시작선을 맞추는 용도라, 아래 두 줄의 "text"가 같은 x에서 시작해야 한다.
 */
export const Indent: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32, paddingTop: 40 }}>
      {sizes.map((size) => (
        <div key={size} style={{ width: 220 }}>
          <p style={{ marginBottom: 8, fontSize: 12 }}>{size}</p>
          <Option size={size} value="withIcon" label="text" leftIcon={Icon.Star} />
          <Option size={size} value="indented" label="text" indent />
          <Option size={size} value="plain" label="text" />
        </div>
      ))}
    </div>
  ),
};
