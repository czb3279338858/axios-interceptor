import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      // 合并.d.ts为一个文件
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'AxiosInterceptor',
      fileName: 'axios-interceptor'
    }
  }
})
