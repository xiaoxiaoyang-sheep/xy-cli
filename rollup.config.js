import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {externals} from "rollup-plugin-node-externals";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import typescript from 'rollup-plugin-typescript2';

export default defineConfig([
    {
        input: {
            index: 'src/index.ts', // 打包入口文件
        },
        output: {
            dir: 'dist', // 输出目标文件,
            format: 'cjs', // 输出commonjs文件
        },
        plugins: [
            nodeResolve(), // 解析处理node模块
            externals({
                devDeps: false, // 可以识别我们 package.json 中的依赖当作外部依赖处理 不会直接将其中引用的方法打包出来
              }),
            typescript(), // 打包ts文件
            json(), // 打包json文件
            commonjs(), // 打包commonjs模块
            terser(), // 构建过程中对生成的 JavaScript 代码进行压缩和混淆，以减小最终输出文件的体积
        ]
    }
])