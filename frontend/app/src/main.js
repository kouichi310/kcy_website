import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetifyのインポート
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// Vuetifyインスタンス作成
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi', 
    },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
