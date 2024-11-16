import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import {vitePluginForArco} from "@arco-plugins/vite-vue";
import {visualizer} from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        vitePluginForArco({
            style: 'css'
        }),
        visualizer({
            open: true, // 打包后自动打开报告页面
            filename: 'dist/report.html', // 生成报告的文件位置
            gzipSize: true, // 显示 gzip 后的文件大小
            brotliSize: true, // 显示 brotli 压缩后的文件大小
        }),
    ],
    optimizeDeps: {
        include: [
            `monaco-editor/esm/vs/language/json/json.worker`,
            `monaco-editor/esm/vs/language/css/css.worker`,
            `monaco-editor/esm/vs/language/html/html.worker`,
            `monaco-editor/esm/vs/language/typescript/ts.worker`,
            `monaco-editor/esm/vs/editor/editor.worker`
        ],
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        sourcemap: true,
        rollupOptions: {
            external: ['node:diagnostics_channel'],
            output: {
                globals: {
                    'node:diagnostics_channel': 'node:diagnostics_channel'
                }
            }
        }
    }
})
