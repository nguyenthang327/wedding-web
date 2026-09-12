// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-08-26',
  debug: false,
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  modules: ['@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      submissionsEndpoint: process.env.NUXT_PUBLIC_SUBMISSIONS_ENDPOINT || ''
    }
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/wedding/img/logo.png?v=20260913-0048' },
        { rel: 'shortcut icon', type: 'image/png', href: '/wedding/img/logo.png?v=20260913-0048' },
        { rel: 'apple-touch-icon', href: '/wedding/img/logo.png?v=20260913-0048' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Cormorant+Infant:wght@400;500;600;700&family=Great+Vibes&display=swap'
        }
      ]
    }
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    locales: [
      {
        code: 'vi',
        name: 'Tiếng Việt',
        language: 'vi-VN',
        file: 'vi.json'
      },
      {
        code: 'en',
        name: 'English',
        language: 'en-US',
        file: 'en.json'
      }
    ]
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/vi']
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/vi': { prerender: true }
  }
})
