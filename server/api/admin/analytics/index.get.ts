import { defineEditorHandler } from '../../../utils/editor-access'
import { analyticsPeriod, getAnalyticsSummary, getArticleSeoReport } from '../../../utils/analytics'
import type { AnalyticsSummary } from '../../../../shared/types/analytics'

// Dashboard data for the analytics page. Signed-in editors only, and always
// served without caching.
export default defineEditorHandler(async (event): Promise<AnalyticsSummary> => {
  const days = analyticsPeriod(event)
  const [summary, seo] = await Promise.all([
    getAnalyticsSummary(days),
    getArticleSeoReport()
  ])
  return { ...summary, seo }
})
