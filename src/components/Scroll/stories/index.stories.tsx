import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { Scroll } from "..";

const meta: Meta<typeof Scroll> = {
  title: "components/Scroll",
  component: Scroll,
};

export default meta;

type Story = StoryObj<typeof Scroll>;

export const Scrollable: Story = {
  render: () => (
    <Scroll maxHeight={200} containerClassName="w-[240px]">
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          style={{
            padding: 8,
            background: i % 2 === 0 ? "#e9ecf2" : "#ffffff",
          }}
        >
          item {i}
        </div>
      ))}
    </Scroll>
  ),
};

const InfiniteScrollDemo = () => {
  const [count, setCount] = useState(10);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 20) {
      setCount((prev) => Math.min(prev + 10, 100));
    }
  };

  return (
    <Scroll maxHeight={200} containerClassName="w-[240px]" onScroll={handleScroll}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            padding: 8,
            background: i % 2 === 0 ? "#e9ecf2" : "#ffffff",
          }}
        >
          item {i}
        </div>
      ))}
    </Scroll>
  );
};

export const InfiniteScroll: Story = {
  render: () => <InfiniteScrollDemo />,
};

export const NotScrollable: Story = {
  render: () => (
    <Scroll maxHeight={200} containerClassName="w-[240px]">
      <div style={{ padding: 8 }}>짧은 콘텐츠</div>
    </Scroll>
  ),
};
