export default defineNuxtRouteMiddleware(async (to) => {
  const code = to.params.code
  if (typeof code !== 'string' || !/^\d{5}$/.test(code)) {
    return abortNavigation(createError({ statusCode: 404, statusText: 'Not Found' }))
  }

  const nuxt = useNuxtApp()
  if (import.meta.server || (nuxt.isHydrating && nuxt.payload.serverRendered)) {
    return
  }

  try {
    await $fetch('/api/admin/path', { query: { code } })
  } catch {
    return abortNavigation(createError({ statusCode: 404, statusText: 'Not Found' }))
  }
})
