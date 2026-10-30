import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";

import { SelectBox } from "..";
import { SelectBoxOptionType } from "../types";
import * as Icon from '../../../icons';

const meta: Meta<typeof SelectBox> = {
  title: "components/SelectBox",
  component: SelectBox,
};

export default meta;

type Story = StoryObj<typeof SelectBox>;

const options: SelectBoxOptionType[] = [
  { label: "회사원", value: "employee" },
  { label: "공무원", value: "public" },
  { label: "자영업", value: "self" },
  { label: "프리랜서", value: "freelancer" },
  { label: "기타", value: "etc" },
];

export const Sizes: Story = {
  render: () => (
    <div
      style={{ display: "flex", gap: 24, paddingTop: 40, paddingBottom: 260 }}
    >
      {/** 폭은 감싸는 쪽이 정한다 — `Input` 스토리와 같은 320px 칸이다. */}
      <div className="w-[320px]">
        <SelectBox size="sm" options={options} placeholder="선택" />
      </div>
      <div className="w-[320px]">
        <SelectBox size="md" options={options} placeholder="선택" />
      </div>
      <div className="w-[320px]">
        <SelectBox size="lg" options={options} placeholder="선택" />
      </div>
    </div>
  ),
};

export const WithFieldLabel: Story = {
  render: () => (
    <div
      style={{ display: "flex", gap: 24, paddingTop: 40, paddingBottom: 260 }}
    >
      <div className="w-[320px]">
        <SelectBox
          size="sm"
          options={options}
          placeholder="선택"
          fieldLabel="직업"
        />
      </div>
    </div>
  ),
};

const manyOptions: SelectBoxOptionType[] = Array.from(
  { length: 8 },
  (_, i) => ({
    label: `항목 ${i + 1}`,
    value: String(i + 1),
  }),
);

const optionsWithIcon: SelectBoxOptionType[] = options.map((option, i) => ({
  ...option,
  leftIcon: i === 0 ? Icon.CircleCheck : undefined,
}));

export const States: Story = {
  render: () => (
    <div
      style={{ display: "flex", gap: 24, paddingTop: 40, paddingBottom: 260 }}
    >
      <div className="w-[320px]">
        <SelectBox size="sm" options={optionsWithIcon} placeholder="선택" />
      </div>
      <div className="w-[320px]">
        <SelectBox
          size="sm"
          options={options}
          placeholder="선택"
          error
          errorMessage="필수 항목입니다"
        />
      </div>
      <div className="w-[320px]">
        <SelectBox size="sm" options={options} placeholder="선택" disabled />
      </div>
      <div className="w-[320px]">
        <p style={{ marginBottom: 8, fontSize: 12, color: "#888" }}>
          옵션이 5줄을 넘으면 자동으로 스크롤(+썸)이 생깁니다.
        </p>
        <SelectBox size="sm" options={manyOptions} placeholder="선택" />
      </div>
    </div>
  ),
};

const longLabelOptions: SelectBoxOptionType[] = [
  { label: "짧음", value: "short" },
  { label: "이것보다 훨씬 더 긴 옵션 라벨입니다", value: "long-1" },
  {
    label:
      "0x42fc0aE3509AbF1B9F5f3c0x42fc0a0x42fc0aE3509AbF1B9F5f3c47463509AbF1B9F5f3c47464746",
    value: "long-2",
  },
];

const shortLabelOptions: SelectBoxOptionType[] = [
  { label: "A", value: "a" },
  { label: "B", value: "b" },
  { label: "C", value: "c" },
];

export const PanelWidth: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, paddingTop: 40, paddingBottom: 260 }}>
      {/** 폭은 감싸는 쪽이 정한다 — `SelectBox`는 `width`를 받지 않는다. */}
      <div className="w-[80px]">
        <p style={{ marginBottom: 8, fontSize: 12, color: "#888" }}>
          트리거는 좁지만(80px) 옵션 라벨이 길어서 패널이 내용에 맞게
          넓어집니다.
        </p>
        <SelectBox
          size="sm"
          options={longLabelOptions}
          placeholder="선택"
        />
      </div>
      <div className="w-[300px]">
        <p style={{ marginBottom: 8, fontSize: 12, color: "#888" }}>
          반대로 트리거는 넓은데(300px) 옵션 내용은 짧은 경우 — 패널 폭
          하한은 트리거 폭이라 내용보다 좁아지지 않습니다.
        </p>
        <SelectBox
          size="sm"
          options={shortLabelOptions}
          placeholder="선택"
        />
      </div>
    </div>
  ),
};

function InfiniteScrollDemo() {
  const [items, setItems] = useState(manyOptions);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const pageRef = useRef(1);

  const handleScrollEnd = () => {
    if (loadingRef.current || pageRef.current >= 4) return;
    loadingRef.current = true;
    setLoading(true);

    setTimeout(() => {
      const page = pageRef.current;
      const nextItems = Array.from({ length: 5 }, (_, i) => {
        const n = page * 8 + i + 1;
        return { label: `항목 ${n}`, value: String(n) };
      });
      setItems((prev) => [...prev, ...nextItems]);
      pageRef.current += 1;
      loadingRef.current = false;
      setLoading(false);
    }, 1200);
  };

  return (
    <SelectBox
      size="sm"
      options={items}
      placeholder="선택"
      loading={loading}
      onScrollEnd={handleScrollEnd}
    />
  );
}

export const InfiniteScroll: Story = {
  render: () => (
    <div
      style={{ display: "flex", gap: 24, paddingTop: 40, paddingBottom: 260 }}
    >
      <div className="w-[320px]">
        <p style={{ marginBottom: 8, fontSize: 12, color: "#888" }}>
          로딩 바 고정 확인용 — 클릭해서 열면 패널 하단에 BarSpinner가 계속
          보입니다.
        </p>
        <SelectBox
          size="sm"
          options={manyOptions}
          placeholder="선택"
          loading
        />
      </div>
      <div className="w-[320px]">
        <p style={{ marginBottom: 8, fontSize: 12, color: "#888" }}>
          실제 로드 확인용 — 클릭해서 연 뒤 목록을 맨 아래까지 스크롤하세요.
          BarSpinner가 뜨고 1.2초 뒤 항목 5개가 추가되며 사라집니다(3번 반복 후
          종료).
        </p>
        <InfiniteScrollDemo />
      </div>
    </div>
  ),
};
