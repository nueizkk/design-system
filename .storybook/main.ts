import { fileURLToPath } from 'node:url';
import path from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// tsup.config.ts의 esbuild alias와 동일 — 패키지 빌드에서만 알던 별칭을
// Storybook의 Vite dev 서버도 풀 수 있도록 맞춰줌.
const alias = {
  tokens: path.resolve(rootDir, '../src/tokens/index.ts'),
  type: path.resolve(rootDir, '../src/compat/type/index.ts'),
  helper: path.resolve(rootDir, '../src/compat/helper/index.ts'),
  'test-util': path.resolve(rootDir, '../src/test-utils/index.ts'),
};

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/react-vite',
  async viteFinal(viteConfig) {
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      ...alias,
    };

    // root postcss.config.js의 tailwind.config.ts는 content가 빈 배열(다른 프로젝트에
    // preset으로 쓰일 때를 위함)이라 Storybook에서 재사용하면 유틸리티가 하나도 안 만들어짐.
    // .storybook/postcss.config.cjs(content 지정)를 찾도록 검색 경로를 이 폴더로 지정.
    // (viteConfig.css.postcss에 plugins 배열을 인라인으로 넣으면 Vite가 content로 지정한
    // .tsx 파일들을 이 CSS의 의존성으로 추적하지 못해 저장해도 자동으로 안 갱신됨.
    // 파일 기반 설정이라야 postcss-load-config를 통해 Vite가 이 관계를 알아챔.)
    viteConfig.css ??= {};
    viteConfig.css.postcss = rootDir;

    return viteConfig;
  },
};

export default config;
