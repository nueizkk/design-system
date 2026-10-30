import type { Meta, StoryObj } from "@storybook/react-vite";

import { Accordion, AccordionSectionType } from "..";
import * as Icon from '../../../icons';

const meta: Meta<typeof Accordion> = {
  title: "components/Accordion",
  component: Accordion,
};

export default meta;

type Story = StoryObj<typeof Accordion>;

const sections: AccordionSectionType[] = [
  {
    label: "header text",
    value: "a",
    icon: Icon.CircleCheck,
    options: [
      { label: "text", value: "a-1" },
      { label: "text", value: "a-2" },
    ],
  },
  {
    label: "header text",
    value: "b",
    icon: Icon.CircleCheck,
    options: [
      { label: "text", value: "b-1" },
      { label: "text", value: "b-2" },
    ],
  },
];

export const Basic: Story = {
  render: () => (
    <div style={{ width: 456 }}>
      <Accordion
        sections={sections}
        defaultOpenValue="a"
        defaultSelectedValue="a-1"
      />
    </div>
  ),
};
