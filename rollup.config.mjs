import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: {
      format: 'iife',
      file: './dist/show-js-error.js',
    },
    plugins: [typescript({ tsconfig: './tsconfig.json' })]
  },
  {
    input: 'src/index.ts',
    output: {
      format: 'es',
      file: './dist/show-js-error.esm.js'
    },
    plugins: [typescript({ tsconfig: './tsconfig.esm.json' })]
  }
];