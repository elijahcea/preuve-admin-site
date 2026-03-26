import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createAuth0 } from '@auth0/auth0-vue'

const app = createApp(App)

app.use(router).use(VueQueryPlugin)

app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_API_AUDIENCE,
    },
  }),
)

app.mount('#app')
