import nodeResolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'

const commonPlugins = [
  nodeResolve({
    extensions: ['.ts', '.tsx'],
  }),
  esbuild({
    include: /\.[jt]sx?$/,
    exclude: /node_modules/,
    sourceMap: false,
    target: 'es2017',
  }),
]

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/cjs/',
      format: 'cjs',
      exports: 'named',
      preserveModules: true,
    },
    plugins: commonPlugins,
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/es/',
      format: 'es',
      preserveModules: true,
    },
    plugins: commonPlugins,
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        compilerOptions: {
          preserveSymlinks: false,
        },
      }),
    ],
  },
]
