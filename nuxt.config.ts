// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: {
    enabled: false
  },

  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/about-nazanin': { redirect: { to: '/nazanin-zarei', statusCode: 301 } }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: [
        '/',
        '/blog',
        '/individual-counselling',
        '/couples-counselling',
        '/family-therapy',
        '/cvap-counselling',
        '/icbc-counseling',
        '/nazanin-zarei',
        '/eft-mental-health-blog/attachment-styles/fearful-avoidant-attachment-when-we-long-for-intimacy-but-fear-getting-close',
        '/trauma/aubadecounselling-com-chronic-fatigue-counselling-vancouver',
        '/personality-disorder/recovery-from-narcissistic-abuse-a-journey-toward-healing',
        '/eating-disorder/navigating-disordered-eating-behaviors',
        '/emotion-regulation/transforming-the-inner-critic',
        '/emotion-regulation/the-cycle-of-anger-and-shame'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
