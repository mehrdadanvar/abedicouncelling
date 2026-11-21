import { setResponseStatus } from 'nuxt/server'

export default defineEditorHandler(async (event) => {
  const { content, publish, slug } = await parseArticleBody(event, createArticleInput)
  const article = await createArticle(slug, await cleanArticleContent(content, publish), publish)
  setResponseStatus(event, 201)
  return article
})
