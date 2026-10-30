import merge from 'lodash/merge';
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

import {
  darkSemanticColors,
  getRgba,
  graphColors,
  lightSemanticColors,
  opacity,
  tailwindConfig,
} from './tokens';
import { hasBakedOpacity } from './tokens/color';

const customConfig: Config = {
  mode: 'jit',
  content: [],
  theme: {
    screens: {},
    extend: {
      keyframes: {
        sidebar: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        skeleton: {
          '30%': { opacity: '0.3' },
        },
      },
      animation: {
        sidebar: 'sidebar 500ms ease',
        skeleton: 'skeleton 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    ...(tailwindConfig.plugins as []),
    plugin(({ addBase }) => {
      /**
       * getColors가 만든 var(--color-*) 참조에 실제 값을 채운다.
       *
       * skipOpacity가 true인 토큰은 단계별 변수를 만들지 않는다. getColors도 해당
       * 토큰의 opacity 조합을 생성하지 않으므로, 만들어두면 참조되지 않는 변수만 남는다.
       */
      const setColors = (
        colorScheme: Record<string, string>,
        prefix = '',
        skipOpacity: (name: string) => boolean = () => false,
      ) => {
        Object.keys(colorScheme).forEach((name) => {
          addBase({
            [prefix + ':root']: {
              [`--color-${name}`]: colorScheme[name],
            },
          });

          if (skipOpacity(name)) return;

          Object.keys(opacity).forEach((opacityItem) => {
            addBase({
              [prefix + ':root']: {
                [`--color-${name}-${opacityItem}`]: getRgba({
                  color: colorScheme[name],
                  opacity: opacity[opacityItem as keyof typeof opacity],
                  isHex: true,
                }),
              },
            });
          });
        });
      };

      setColors(lightSemanticColors, '', hasBakedOpacity);
      setColors(darkSemanticColors, '.dark', hasBakedOpacity);
      setColors(graphColors);
    }),
  ],
};

export const tailwindPreset: Config = merge({}, tailwindConfig, customConfig);

export default tailwindPreset;
