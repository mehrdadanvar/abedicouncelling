export function useCounsellorSchema() {
  const { url } = useSiteConfig()
  return definePerson({
    '@id': new URL('/#nazanin-zarei', url).href,
    'name': 'Nazanin Zarei',
    'jobTitle': 'Clinical Counsellor',
    'url': new URL('/about', url).href,
    'image': new URL('/images/about-hero.webp', url).href,
    'worksFor': { '@id': new URL('/#organization', url).href },
    'knowsAbout': [
      'Emotion-Focused Therapy',
      'S.A.F.E. EMDR',
      'Somatic Therapy',
      'Art Therapy',
      'Gestalt therapy',
      'Attachment theory'
    ]
  })
}
