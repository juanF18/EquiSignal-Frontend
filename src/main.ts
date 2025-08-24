import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { router } from './router'
import { createPinia } from 'pinia'
import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'

const app = createApp(App)
// Opciones (ejemplo: retry 1 vez)
const vueQueryOptions: VueQueryPluginOptions = {
    queryClientConfig: {
        defaultOptions: {
            queries: {
                retry: 1,
                refetchOnWindowFocus: false, // que no recargue al cambiar de pestaña
            },
        },
    },
};
app.use(VueQueryPlugin, vueQueryOptions);
app.use(createPinia())
app.use(router)
app.mount('#app')

