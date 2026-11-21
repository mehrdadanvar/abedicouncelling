// https://nuxt.com/docs/api/configuration/nuxt-config
import { legacyRedirects } from './app/data/redirects'

const siteUrl = 'https://aubadecounselling.com'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/seo',
    '@nuxt/fonts',
    '@nuxthub/core',
    'nuxt-auth-utils'
  ],

  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: siteUrl,
    name: 'Aubade Counselling',
    description: 'Compassionate individual, couples, family, CVAP and ICBC counselling in North Vancouver with Nazanin Zarei.',
    defaultLocale: 'en-CA',
    trailingSlash: false
  },

  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24 * 7
    },
    cms: {
      editorEmail: '',
      uploadsDir: '.data/uploads'
    }
  },

  // Trailing-slash redirects live in public/_redirects only, since route rules
  // here also match the clean URL and would turn the page into a redirect loop.
  routeRules: {
    ...Object.fromEntries(legacyRedirects.map(({ from, to }) => [from, { redirect: { to, statusCode: 301 } }])),
    '/': { prerender: false },
    '/blog': { prerender: false },
    '/blog/**': { prerender: false },
    '/admin': { prerender: false, headers: { 'x-robots-tag': 'noindex', 'cache-control': 'private, no-store' } },
    '/admin/**': { prerender: false, headers: { 'x-robots-tag': 'noindex', 'cache-control': 'private, no-store' } },
    '/sitemap.xml': { prerender: false },
    '/sitemap_index.xml': { prerender: false }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: [
        '/individual-counselling',
        '/couples-counselling',
        '/family-counselling',
        '/cvap-counselling',
        '/icbc-counselling',
        '/about'
      ]
    }
  },

  hub: {
    db: {
      dialect: 'sqlite',
      driver: 'libsql',
      applyMigrationsDuringBuild: false,
      applyMigrationsDuringDev: false
    }
  },

  aiReady: false,

  auth: {
    loadStrategy: 'none'
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  fonts: {
    families: [
      { name: 'Sarabun', provider: 'google', weights: [400, 500, 600, 700], styles: ['normal', 'italic'] },
      { name: 'Open Sans', provider: 'google', weights: [400, 500, 600, 700], styles: ['normal', 'italic'] },
      { name: 'Marcellus', provider: 'google', weights: [400] },
      { name: 'Inter', provider: 'google', weights: [400, 500, 600] },
      { name: 'Belleza', provider: 'google', weights: [400] }
    ]
  },

  ogImage: {
    enabled: false
  },

  schemaOrg: {
    identity: {
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/#organization`,
      'name': 'Aubade Counselling',
      'url': siteUrl,
      'logo': `${siteUrl}/images/logo.svg`,
      'image': `${siteUrl}/images/home-hero.webp`,
      'telephone': '+1-778-504-2135',
      'email': 'Info@aubadecounselling.com',
      'priceRange': '$$',
      'areaServed': 'North Vancouver, BC',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '145 Chadwick Court, Suite 400',
        'addressLocality': 'North Vancouver',
        'addressRegion': 'BC',
        'postalCode': 'V7M 3K1',
        'addressCountry': 'CA'
      }
    }
  },

  sitemap: {
    discoverImages: false,
    exclude: ['/admin', '/admin/**'],
    sources: ['/api/__sitemap__/articles'],
    cacheMaxAgeSeconds: 0
  },

  skewProtection: false
})
