import { defineConfig } from 'vite'
import dtsPlugin from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'AxiosInterceptor',
      fileName: 'axios-interceptor'
    },
    target: 'es2015',
    rollupOptions: {
      external: ["axios"]
    }
  },
  plugins: [dtsPlugin({
    outDir: './dist/types',
  })]
})
