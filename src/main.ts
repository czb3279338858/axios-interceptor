import { createApp } from 'vue'
import App from './App.vue'
import { selfAxios } from './selfAxios'
import { initSelfAxios } from './utils/initSelfAxios'

initSelfAxios(selfAxios)

createApp(App).mount('#app')