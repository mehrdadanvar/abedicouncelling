export default defineEditorHandler(async (event) => {
  const { content, publish, revision } = await parseArticleBody(event, updateArticleInput)
  return updateArticle(articleId(event), revision, await cleanArticleContent(content, publish), publish)
})
