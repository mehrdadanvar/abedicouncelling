export interface Redirect {
  from: string
  to: string
}

const legacy: Redirect[] = [
  { from: '/about-nazanin', to: '/about' },
  { from: '/nazanin-zarei', to: '/about' },
  { from: '/family-therapy', to: '/family-counselling' },
  { from: '/icbc-counseling', to: '/icbc-counselling' },
  { from: '/eft-mental-health-blog/attachment-styles/fearful-avoidant-attachment-when-we-long-for-intimacy-but-fear-getting-close', to: '/blog/fearful-avoidant-attachment' },
  { from: '/trauma/aubadecounselling-com-chronic-fatigue-counselling-vancouver', to: '/blog/eft-chronic-fatigue' },
  { from: '/personality-disorder/recovery-from-narcissistic-abuse-a-journey-toward-healing', to: '/blog/narcissistic-abuse-recovery' },
  { from: '/eating-disorder/navigating-disordered-eating-behaviors', to: '/blog/disordered-eating' },
  { from: '/emotion-regulation/transforming-the-inner-critic', to: '/blog/inner-critic' },
  { from: '/emotion-regulation/the-cycle-of-anger-and-shame', to: '/blog/anger-and-shame' },
  { from: '/category/eating-disorder', to: '/blog' },
  { from: '/category/personality-disorder', to: '/blog' },
  { from: '/category/emotion-regulation', to: '/blog' },
  { from: '/category/trauma', to: '/blog' }
]

const canonicalPaths = [
  '/individual-counselling',
  '/couples-counselling',
  '/family-counselling',
  '/cvap-counselling',
  '/icbc-counselling',
  '/about',
  '/blog'
]

export const legacyRedirects: Redirect[] = [
  ...legacy,
  ...legacy.map(r => ({ from: `${r.from}/`, to: r.to }))
]

export const trailingSlashRedirects: Redirect[] = canonicalPaths.map(path => ({
  from: `${path}/`,
  to: path
}))

export const redirects: Redirect[] = [...legacyRedirects, ...trailingSlashRedirects]
