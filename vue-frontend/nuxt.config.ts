// Get base url, and make sure it has a triling slash
const baseURL = (process.env.NUXT_APP_BASE_URL || '/mirte-website/').replace(/\/?$/, '/');

export default defineNuxtConfig({
  app: {
    baseURL,
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: `${baseURL}favicon.png` }
      ]
    }
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  devtools: { enabled: true },
  css: ['bootstrap/dist/css/bootstrap.min.css', '@/assets/scss/main.scss'],
  plugins: ['@/plugins/bootstrap.client.js'],
  modules: ['@nuxtjs/i18n', '@nuxt/image', '@nuxt/fonts'],

  fonts: {
    families: [
      {
        name: 'Livvic',
        provider: 'google',
        weights: [700]
      },
      {
        name: 'Overpass',
        provider: 'google',
        weights: [300, 700]
      },
    ]
  },

  i18n: {
    strategy: 'prefix',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English' },
      { code: 'nl', language: 'nl-NL', name: 'Nederlands' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: true,
    },
    vueI18n: './i18n.config.ts',
    baseUrl: 'https://mirte.org'
  },

  vue: {
    compilerOptions: {
      hydrationMismatchDetails: true
    }
  },

  vite: {
    plugins: [
      require('vite-svg-loader')({svgo: false}) // disables SVGO optimization, keeps IDs intact for translations
    ]
  },

  nitro: {
    preset: 'static',
  },

  compatibilityDate: '2025-08-14',
})