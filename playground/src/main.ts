import antd from 'antdv-next'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import DocHeading from '@/components/docs/heading.vue'
import { router } from '@/routes'
import App from './App.vue'
import CodeDemo from './components/code-demo'
import 'antdv-next/style/reset.css'
import 'uno.css'
import './assets/styles/layout/index.css'
import './assets/styles/markdown/index.css'
import './assets/styles/common.css'

const app = createApp(App)
app.use(router)
app.use(antd)
app.use(CodeDemo)
app.component('DocHeading', DocHeading)
app.use(createPinia())
app.mount('#app')
