import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: {
      format: 'iife',
      file: './dist/show-js-error.js',
    },
    plugins: [typescript()]
  },
  {
    input: 'src/index.ts',
    output: {
      format: 'es',
      file: './dist/show-js-error.esm.js'
    },
    plugins: [typescript()]
  }
];