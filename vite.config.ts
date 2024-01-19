import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      outDir: './dist/types',
      include: 'lib'
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
