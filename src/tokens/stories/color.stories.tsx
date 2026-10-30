import type { Meta, StoryObj } from '@storybook/react-vite';

import { darkSemanticColors, graphColors, lightSemanticColors } from '../color';
/**
 * 팔레트는 `color/index.ts`가 폴더 밖으로 일부러 내보내지 않는다 — 컴포넌트가
 * 원시 색을 직접 쓰지 못하게 막기 위함이다. 이 스토리는 소비가 아니라 문서라
 * 예외로 직접 참조한다. **컴포넌트에서는 따라 하면 안 된다.**
 */
import { colors } from '../color/palette';

import { Checker } from './Checker';
import { TokenTable } from './TokenTable';

const meta: Meta = { title: 'tokens/color' };
export default meta;

type Story = StoryObj;

/** 색이 주인공이라 칸을 꽉 채운다 — 이름·hex는 왼쪽 두 칸에 이미 있다. */
const Swatch = ({ hex, label }: { hex: string; label?: string }) => (
  <span className="flex flex-1 flex-col gap-1">
    <Checker className="h-10">
      <span
        className="block size-full rounded"
        style={{ backgroundColor: hex }}
      />
    </Checker>
    {label && <span className="text-label-alternative">{label}</span>}
  </span>
);

/**
 * 시맨틱 컬러 35종. light가 원본이고 dark는 같은 키를 그대로 덮어쓰므로
 * (`semantic.ts`) 두 값을 한 줄에 나란히 둬야 차이가 보인다.
 */
export const Semantic: Story = {
  render: () => (
    <TokenTable
      tokens={Object.fromEntries(
        Object.keys(lightSemanticColors).map((name) => [
          name,
          {
            light: lightSemanticColors[name as keyof typeof lightSemanticColors],
            dark: darkSemanticColors[name as keyof typeof darkSemanticColors],
          },
        ]),
      )}
      format={({ light, dark }) => `light ${light}\ndark  ${dark}`}
      preview={({ light, dark }) => (
        <span className="flex gap-4 py-1">
          <Swatch hex={light} label="light" />
          <Swatch hex={dark} label="dark" />
        </span>
      )}
    />
  ),
};

/** 차트 전용 색. light/dark 구분이 없다. */
export const Graph: Story = {
  render: () => (
    <TokenTable
      tokens={graphColors}
      preview={(hex) => (
        <span className="flex py-1">
          <Swatch hex={hex} />
        </span>
      )}
    />
  ),
};

/**
 * 계열은 이름에서 끌어온다 — 팔레트에 색이 추가돼도 여기 손댈 일이 없다.
 * `transparent`·`black`·`white`처럼 단계가 없는 이름은 base로 묶는다.
 */
const families = Object.entries(colors).reduce<Record<string, string[][]>>(
  (acc, [name, hex]) => {
    const dash = name.lastIndexOf('-');
    const family = dash === -1 ? 'base' : name.slice(0, dash);
    const step = dash === -1 ? name : name.slice(dash + 1);
    acc[family] = [...(acc[family] ?? []), [step, hex]];
    return acc;
  },
  {},
);

/**
 * 시맨틱이 가리키는 원시 색 전부. 대조용으로만 본다 — 새 색이 필요하면 여기서
 * 고르는 게 아니라 시맨틱을 먼저 정의한다.
 */
export const Palette: Story = {
  render: () => (
    <div className="text-label-normal flex flex-col gap-8 font-mono text-xs">
      {Object.entries(families).map(([family, steps]) => (
        <section key={family} className="flex flex-col gap-2">
          <h2 className="typo-body-2 font-semibold">{family}</h2>
          <div className="flex flex-wrap gap-2">
            {steps.map(([step, hex]) => (
              <div key={step} className="w-24">
                <Checker className="h-16">
                  <span
                    className="block size-full rounded"
                    style={{ backgroundColor: hex }}
                  />
                </Checker>
                <div className="mt-1">{step}</div>
                <div className="text-label-alternative">{hex}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
