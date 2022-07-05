import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import dts from 'vite-plugin-dts'
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      outputDir: './dist/types',
      tsConfigFilePath: "./tsconfig.json",
      insertTypesEntry: true
    }),
    vue(),
    visualizer({
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'AxiosInterceptor',
      // the proper extensions will be added
      fileName: 'axios-interceptor'
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'axios'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          axios: 'axios'
          // vue: 'Vue'
        }
      }
    }
  }
})
