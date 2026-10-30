import type { Meta, StoryObj } from '@storybook/react-vite';

import { IconBase, iconSize, type IconSizeType } from '../base';
import * as Icon from '..';

/**
 * 아이콘 전수를 한눈에 보기 위한 카탈로그. 개별 아이콘은 컴포넌트가 아니라
 * 네임스페이스 멤버라 Storybook의 `component`로 지정할 수 없어 IconBase를 둔다.
 */
const meta: Meta<typeof IconBase> = {
  title: 'icons/Icon',
  component: IconBase,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof IconBase>;

/**
 * 카탈로그라서 네임스페이스를 통째로 순회한다 — 이러면 트리셰이킹이 죽지만
 * 스토리는 배포물이 아니라 무방하다. 실제 코드에서는 절대 이렇게 쓰지 않는다.
 */
const ENTRIES = Object.entries(Icon).filter(
  ([, value]) => typeof value === 'function',
) as [string, Icon.IconComponentType][];

const SOLID = ENTRIES.filter(([n]) => n.endsWith('Solid'));
const OUTLINE = ENTRIES.filter(([n]) => !n.endsWith('Solid'));

function Grid({
  entries,
  color,
}: {
  entries: typeof ENTRIES;
  color?: Icon.IconProps['color'];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([name, Cmp]) => (
        <div
          key={name}
          className="border-line-normal flex w-28 flex-col items-center gap-2 rounded-sm border p-3"
        >
          <Cmp color={color} />
          <span className="typo-caption-1 text-label-alternative w-full truncate text-center">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="typo-subtitle-2 text-label-normal font-semibold">{title}</h2>
      {children}
    </section>
  );
}

/** 전체 아이콘. outline과 solid를 나눠 보여준다. */
export const All: Story = {
  render: () => (
    <div className="bg-background-normal flex flex-col gap-8 p-6">
      <Section title={`Outline (${OUTLINE.length})`}>
        <Grid entries={OUTLINE} />
      </Section>
      <Section title={`Solid (${SOLID.length})`}>
        <Grid entries={SOLID} />
      </Section>
    </div>
  ),
};

/** color prop이 전부에 먹는지 확인. Kor/Eng는 브랜드색 고정이라 안 변하는 게 정상. */
export const Colored: Story = {
  render: () => (
    <div className="bg-background-normal flex flex-col gap-8 p-6">
      {(
        [
          'label-normal',
          'status-main-negative',
          'status-main-positive',
          'primary-normal',
        ] as const
      ).map((color) => (
        <Section key={color} title={color}>
          <Grid entries={ENTRIES} color={color} />
        </Section>
      ))}
    </div>
  ),
};

/** size 7단계. Figma `icons Responsive`의 variant와 1:1 대응한다. */
export const Sizes: Story = {
  render: () => (
    <div className="bg-background-normal flex flex-col gap-6 p-6">
      {(Object.keys(iconSize) as IconSizeType[]).map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="typo-caption-1 text-label-alternative w-16">
            {size} ({iconSize[size]})
          </span>
          <Icon.Star size={size} />
          <Icon.StarSolid size={size} />
          <Icon.Kor size={size} />
          <Icon.Eng size={size} />
        </div>
      ))}
    </div>
  ),
};

/** 부모의 text 색을 상속하는지 확인 — fill="currentColor"라 가능해진 동작. */
export const Inherited: Story = {
  render: () => (
    <div className="bg-background-normal flex flex-col gap-4 p-6">
      {(['text-status-main-negative', 'text-primary-normal'] as const).map(
        (cls) => (
          <p key={cls} className={`typo-body-1 flex items-center gap-2 ${cls}`}>
            <Icon.CircleExclamationMark className="text-inherit" size="sm" />
            부모의 {cls}를 상속한다
          </p>
        ),
      )}
    </div>
  ),
};
