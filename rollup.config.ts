// babel插件用于处理es6代码的转换，使转换出来的代码可以用于不支持es6的环境使用
import babel from 'rollup-plugin-babel';
// resolve将我们编写的源码与依赖的第三方库进行合并
import resolve from 'rollup-plugin-node-resolve';
// 解决rollup.js无法识别CommonJS模块
import commonjs from 'rollup-plugin-commonjs';
// 使rollup可以使用postCss处理样式文件less、css等
import postcss from 'rollup-plugin-postcss';
// css代码压缩
import cssnano from 'cssnano';
// 压缩打包代码
import { terser } from 'rollup-plugin-terser';
import vuePlugin from 'rollup-plugin-vue'
// 处理css定义的变量
// import simplevars from 'postcss-simple-vars';
// 处理less嵌套样式写法
// import nested from 'postcss-nested';
// 替代cssnext
// import postcssPresetEnv from 'postcss-preset-env';

import typescript from "rollup-plugin-typescript2";
// import sourceMaps from "rollup-plugin-sourcemaps";
import jsonPlugin from '@rollup/plugin-json'

const NAME = 'VueDusionKeyboard'

export default {
  input: 'src/components/index.ts',
  moduleName: 'ModuleName',
  external: ['vue'],
  globals: {
    vue: 'Vue',
  },
  output: [
    {
      file: `lib/${NAME}.es.js`,
      format: 'es',
      sourcemap: true
    },
    {
      file: `lib/${NAME}.cjs.js`,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: `lib/${NAME}.umd.js`,
      format: 'umd',
      sourcemap: true,
      name: NAME
    },
  ],
  plugins: [
    jsonPlugin(),
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript"),
      tsconfigOverride: {
        include: [
          'src/components',
          "src/components/**/*.vue",
        ],
      },
      useTsconfigDeclarationDir: true
    }),
    resolve({extensions:['.vue']}),
    commonjs(),
    vuePlugin({
      // 把单文件组件中的样式，插入到html中的style标签
      css: false,
      // 把组件转换成 render 函数
      // compileTemplate: true
    }),
    postcss({
      plugins: [
        cssnano(),
      ],
      extensions: ['.css', '.scss']
    }),
    // sourceMaps(),
    // babel处理不包含node_modules文件的所有js
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      plugins: [
        "@babel/plugin-external-helpers"
      ]
    }),
    // 生产环境执行terser压缩代码
    terser(),
    //删除console.log
    {
      name: 'replace',
      transform(code) {
        return code
          .replace(/console.log\([\s\S]+?\);?/g, '')
      },
    }
  ]
};