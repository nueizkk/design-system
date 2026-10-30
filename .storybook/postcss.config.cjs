const path = require('node:path');

// root의 postcss.config.js가 쓰는 tailwind.config.ts는 content가 빈 배열이라
// (다른 프로젝트에 preset으로 쓰일 때를 위함) Storybook에서는 재사용 불가.
// 같은 preset에 Storybook 전용 content를 지정해 별도로 둔다.
const tailwindPreset = require('../dist/tailwind.cjs').default;

module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {
      presets: [tailwindPreset],
      content: [path.join(__dirname, '../src/**/*.{ts,tsx}')],
    },
    autoprefixer: {},
  },
};
