import { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { CSSRuleObject } from 'tailwindcss/types/config';

import { getColors, createColorClasses } from './color';
import { gradient, gradientUtilities } from './gradient';
import { shadow } from './shadow';
import { spacing } from './spacing';
import { radius } from './radius';
import { zIndex } from './zIndex';

import { typographyUtilities } from './typography';
import { weight } from './weight';
import { opacity } from './opacity';

export const tailwindConfig: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: getColors(),
    boxShadow: shadow,
    opacity,
    fontWeight: weight,
    borderRadius: radius,
    spacing,
    zIndex,
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      animation: {
        blink: 'blink 1.5s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities(typographyUtilities);
    }),
    plugin(function ({ addUtilities }) {
      addUtilities(gradientUtilities);
    }),
    plugin(function ({ addUtilities, theme, e }) {
      const newUtilities: CSSRuleObject = {};
      const colors = theme('colors') as Record<string, string>;
      Object.keys(colors).forEach((color) => {
        const value = colors[color];
        newUtilities[`.overlay-${e(color)}`] = {
          [`&::after`]: {
            backgroundColor: value,
          },
        };
      });
      addUtilities(newUtilities);
    }),
  ],
  safelist: [
    ...Object.values(createColorClasses('fill')),
    ...Object.values(createColorClasses('stroke')),
    ...Object.values(createColorClasses('text')),
    // 레포 내 사용처가 없어도 소비 서비스에서 쓰므로 dist/styles.css에 남긴다
    ...Object.keys(gradient).map((direction) => `gradient-${direction}`),
  ],
};
