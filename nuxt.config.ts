// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/test-utils/module',
    '@pinia/nuxt',
    '@nuxt/image'
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
