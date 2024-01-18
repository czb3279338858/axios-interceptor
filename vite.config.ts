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
    target: 'es2015',
    lib: {
      entry: './lib/main.ts',
      name: 'AxiosInterceptor',
      fileName: 'axios-interceptor'
    }
  }
})
