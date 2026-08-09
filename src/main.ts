import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/styles/index.scss'
import App from './page/index.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(ElementPlus)
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')