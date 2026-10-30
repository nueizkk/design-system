import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { defineConfig, Options } from 'tsup';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const alias = {
  tokens: path.resolve(rootDir, 'src/tokens/index.ts'),
  'test-util': path.resolve(rootDir, 'src/test-utils/index.ts'),
};

export default defineConfig(() => {
  const commonOptions: Partial<Options> = {
    entry: {
      index: 'src/index.ts',
      tokens: 'src/tokens/index.ts',
      tailwind: 'src/tailwind.ts',
      icons: 'src/icons/index.ts',
    },
    splitting: false, // cjs는 splitting 미지원
    dts: true,
    clean: true,
    external: ['react', 'react-dom'],
    noExternal: ['lodash', 'dayjs'],
    esbuildOptions(options) {
      options.alias = {
        ...(options.alias ?? {}),
        ...alias,
      };
    },
  };

  return [
    {
      ...commonOptions,
      format: ['cjs'],
    },
    {
      ...commonOptions,
      format: ['esm'],
      splitting: true,
    },
  ];
});
