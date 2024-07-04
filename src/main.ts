import { createApp } from 'vue'
import Vue3ColorPicker from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import './style.css'
import App from './App.vue'

createApp(App).use(Vue3ColorPicker).mount('#app')
