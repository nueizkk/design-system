import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '..';

const meta: Meta<typeof Text> = {
  title: 'components/Text',
  component: Text,
  args: { children: '다람쥐 헌 쳇바퀴에 타고파 The quick brown fox' },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'headline-1', 'headline-2', 'headline-3', 'headline-4',
        'subtitle-1', 'subtitle-2',
        'body-1', 'body-2',
        'caption-1', 'caption-2',
      ],
    },
    weight: {
      control: 'radio',
      options: ['light', 'regular', 'semibold', 'bold'],
    },
    as: { control: 'select', options: ['span', 'p', 'label', 'h1', 'h2', 'h6'] },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Playground: Story = {};

const VARIANTS = [
  'headline-1', 'headline-2', 'headline-3', 'headline-4',
  'subtitle-1', 'subtitle-2',
  'body-1', 'body-2',
  'caption-1', 'caption-2',
] as const;

/** 타이포그래피 스케일 10종. */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex items-baseline gap-4">
          <Text variant="caption-2" color="label-assistive" className="w-24 shrink-0">
            {variant}
          </Text>
          <Text variant={variant}>다람쥐 헌 쳇바퀴에 타고파</Text>
        </div>
      ))}
    </div>
  ),
};

/** Weight 4종. */
export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {(['light', 'regular', 'semibold', 'bold'] as const).map((weight) => (
        <Text key={weight} weight={weight}>
          {weight} — 다람쥐 헌 쳇바퀴에 타고파
        </Text>
      ))}
    </div>
  ),
};

/**
 * `as`는 **시각적 외형을 바꾸지 않는다.** 글자 크기(`variant`)와 문서 구조는
 * 별개 축이다. 셋 다 같은 크기로 보이지만 DOM은 span / p / h2로 다르다.
 */
export const SemanticTag: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text variant="subtitle-1">as 생략 — span</Text>
      <Text as="p" variant="subtitle-1">as=&quot;p&quot; — 문단</Text>
      <Text as="h2" variant="subtitle-1">as=&quot;h2&quot; — 문서 제목</Text>
    </div>
  ),
};

/**
 * 기본이 inline(span)이라 **문장 안에 자연스럽게 섞인다.** 블록 동작이
 * 필요하면 부모가 flex/grid로 맥락을 주거나 `as="p"`를 쓴다.
 */
export const Inline: Story = {
  render: () => (
    <p className="typo-body-1 text-label-normal">
      이 문장 안에{' '}
      <Text weight="bold" color="status-main-negative">
        강조된 부분
      </Text>
      이 끼어 있고{' '}
      <Text variant="caption-1" color="label-assistive">
        작은 주석
      </Text>
      도 같은 줄에 흐른다.
    </p>
  ),
};

/**
 * 정렬·말줄임은 Text의 prop이 아니다 — **레이아웃은 부모가 결정한다.**
 * inline 요소에는 `text-align`도 `overflow`도 적용되지 않으므로, 부모가 폭을
 * 주고(flex 아이템이 되면 블록화된다) 필요한 유틸리티를 `className`으로 준다.
 */
export const LayoutIsParentsJob: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Text variant="caption-2" color="label-assistive">
          정렬 — 부모의 justify-* 로
        </Text>
        <div className="border-line-normal flex w-[240px] justify-center border p-2">
          <Text>가운데</Text>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Text variant="caption-2" color="label-assistive">
          말줄임 — 부모가 폭을 주고 className=&quot;truncate&quot;
        </Text>
        <div className="border-line-normal flex w-[240px] border p-2">
          <Text className="truncate">
            아주 긴 텍스트가 들어가면 말줄임표로 잘린다 다람쥐 헌 쳇바퀴에 타고파
          </Text>
        </div>
      </div>
    </div>
  ),
};

const COLORS = [
  'label-normal', 'label-alternative', 'label-assistive', 'label-disable',
  'primary-normal', 'status-main-positive', 'status-main-negative', 'status-main-standby',
] as const;

/** 시맨틱 컬러 토큰. */
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-1">
      {COLORS.map((color) => (
        <Text key={color} color={color}>
          {color}
        </Text>
      ))}
    </div>
  ),
};
