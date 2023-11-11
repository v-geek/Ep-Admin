import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import pinia from './store'

import { MotionPlugin } from '@vueuse/motion'
import Colada from 'colada-plugin'

import '@/styles/index.scss'

// 注册使用 svg icon
// https://github.com/vbenjs/vite-plugin-svg-icons/blob/main/README.zh_CN.md
import 'virtual:svg-icons-register'

// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/styles/index.scss整体css文件导致热更新慢的问题
import '@/styles/tailwind.css'

// element-plus 内置暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

import { registerGlobComp } from '@/components'

import errorHandler from '@/utils/errorHandler'

import i18n from '@/languages/index'

const app = createApp(App)

app.config.errorHandler = errorHandler

registerGlobComp(app)

app.use(router).use(pinia).use(Colada).use(i18n).use(MotionPlugin).mount('#app')
