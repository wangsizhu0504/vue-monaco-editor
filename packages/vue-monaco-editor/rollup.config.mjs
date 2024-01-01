import nodeResolve from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import terser from '@rollup/plugin-terser'

const commonPlugins = [
  nodeResolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }),
  esbuild({
    include: /\.[jt]sx?$/,
    exclude: /node_modules/,
    sourceMap: false,
    target: 'es2017',
  }),
]

const external = ['monaco-editor-loader', 'vue', 'vue-demi', /node_modules/]
const globalsForUMD = {
  'monaco-editor-loader': 'monaco_loader',
  'vue-demi': 'VueDemi',
  'vue': 'Vue',
}

export default [
  {
    input: 'src/index.ts',
    external,
    output: {
      exports: 'named',
      dir: 'dist/cjs/',
      format: 'cjs',
    },
    plugins: commonPlugins,
  },
  {
    input: 'src/index.ts',
    external,
    output: {
      exports: 'named',
      dir: 'dist/es/',
      format: 'es',
    },
    plugins: commonPlugins,
  },
  {
    input: 'src/index.ts',
    external,
    output: {
      exports: 'named',
      file: 'dist/umd/vue-monaco-editor.js',
      format: 'umd',
      globals: globalsForUMD,
      name: 'vue_monaco_editor',
    },
    plugins: commonPlugins,
  },
  {
    input: 'src/index.ts',
    external,
    output: {
      exports: 'named',
      file: 'dist/umd/vue-monaco-editor.min.js',
      format: 'umd',
      globals: globalsForUMD,
      name: 'vue_monaco_editor',
    },
    plugins: [
      ...commonPlugins,
      terser({
        mangle: false,
      }),
    ],
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
