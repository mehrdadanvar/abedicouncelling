import { sendRedirect } from 'nuxt/server'

export default defineOAuthGoogleEventHandler({
  config: { scope: ['openid', 'email'] },
  async onSuccess(event, { user }) {
    if (user.email_verified !== true || typeof user.email !== 'string' || !isEditorEmail(user.email)) {
      return sendRedirect(event, '/admin?sign-in=denied')
    }

    await replaceUserSession(event, { user: { email: user.email } })
    return sendRedirect(event, '/admin')
  },
  onError: event => sendRedirect(event, '/admin?sign-in=failed')
})
