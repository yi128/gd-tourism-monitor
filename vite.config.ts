import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// 引入自动导入插件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',      // 局域网内其他设备可访问
    port: 5173,
    strictPort: true,
    open: true,
    cors: true,

    // HMR 热更新
    hmr: {
      overlay: true,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 第三方库拆分
          if (id.includes('node_modules')) {
            if (id.includes('echarts')) return 'echarts'           
            if (id.includes('element-plus')) return 'element-plus' 
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vue-vendor'
            }
            return 'vendor'  // 其他小依赖
          }
        },
      },
    },
  },
  plugins: [
    vue(),
    // 配置 AutoImport
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    // 配置 Components
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    // 配置路径别名
    alias: {
      '@': resolve(__dirname, 'src'),
      '@stores': resolve(__dirname, 'src/stores')
    }
  }
})
