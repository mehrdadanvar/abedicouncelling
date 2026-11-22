<script setup lang="ts">
import type { AnalyticsPeriodDays, AnalyticsSummary } from '#shared/types/analytics'

definePageMeta({ layout: 'admin', middleware: 'admin', robots: 'noindex, nofollow', key: route => route.path })
useSeoMeta({ title: 'Analytics' })

const route = useRoute()
const code = computed(() => String(route.params.code))
const period = ref<AnalyticsPeriodDays>(7)

const { data, status, error, refresh } = await useFetch<AnalyticsSummary>('/api/admin/analytics', {
  query: { days: period }
})

if (error.value?.statusCode === 401 || error.value?.statusCode === 403) {
  await navigateTo(`/${code.value}`)
}

const pageLabels: Record<string, string> = {
  '/': 'Home',
  '/about': 'About me',
  '/blog': 'Blog',
  '/individual-counselling': 'Individual counselling',
  '/couples-counselling': 'Couples counselling',
  '/family-counselling': 'Family counselling',
  '/cvap-counselling': 'CVAP counselling',
  '/icbc-counselling': 'ICBC counselling'
}

function pageLabel(path: string) {
  if (pageLabels[path]) return pageLabels[path]
  if (path.startsWith('/blog/')) return `Article · ${path.slice('/blog/'.length)}`
  return path
}

function dayLabel(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${date}T00:00:00Z`))
}

// The area and line share a scale so their heights are directly comparable.
const chart = computed(() => {
  const daily = data.value?.daily ?? []
  const width = 720
  const height = 230
  const padX = 10
  const padTop = 14
  const padBottom = 28
  const count = Math.max(daily.length, 2)
  const maxCount = Math.max(1, ...daily.map(point => Math.max(point.views, point.clicks)))
  const x = (index: number) => padX + index * (width - padX * 2) / (count - 1)
  const y = (value: number) => padTop + (1 - value / maxCount) * (height - padTop - padBottom)

  const viewPoints = daily.map((point, index) => `${x(index)},${y(point.views)}`)
  const clickPoints = daily.map((point, index) => `${x(index)},${y(point.clicks)}`)
  return {
    width,
    height,
    count,
    daily,
    x,
    areaPath: viewPoints.length
      ? `M${viewPoints.join(' L')} L${x(count - 1)},${height - padBottom} L${x(0)},${height - padBottom} Z`
      : '',
    linePath: clickPoints.length ? `M${clickPoints.join(' L')}` : ''
  }
})

const summaryRows = computed(() => [
  { label: 'Page views', value: data.value?.views ?? 0, hint: `Last ${data.value?.days ?? period.value} days` },
  { label: 'Clicks', value: data.value?.clicks ?? 0, hint: 'Links and buttons on public pages' },
  { label: 'Booking clicks', value: data.value?.bookingClicks ?? 0, hint: 'Clicks on the booking service link' }
])

const seoCounts = computed(() => {
  const checks = data.value?.seo.checks ?? []
  return {
    total: checks.length,
    seoTitle: checks.filter(check => check.missingSeoTitle).length,
    metaDescription: checks.filter(check => check.missingMetaDescription).length,
    coverAlt: checks.filter(check => check.missingCoverAlt).length
  }
})
</script>

<template>
  <section>
    <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-highlighted">
          Analytics
        </h1>
        <p class="text-sm text-dimmed">
          Views and interactions on the public website.
        </p>
      </div>
      <div class="flex items-center gap-1 rounded-lg border border-default bg-default p-1">
        <UButton
          :variant="period === 7 ? 'solid' : 'ghost'"
          color="neutral"
          size="sm"
          label="Last 7 days"
          @click="period = 7"
        />
        <UButton
          :variant="period === 30 ? 'solid' : 'ghost'"
          color="neutral"
          size="sm"
          label="Last 30 days"
          @click="period = 30"
        />
      </div>
    </div>

    <UAlert
      v-if="error"
      class="mb-5"
      color="error"
      variant="soft"
      title="The analytics data could not load."
      :actions="[{ label: 'Try again', onClick: () => refresh() }]"
    />
    <div
      v-else-if="status === 'pending'"
      class="space-y-3"
      aria-busy="true"
      aria-label="Loading analytics"
    >
      <USkeleton class="h-28 w-full" />
      <USkeleton class="h-64 w-full" />
      <USkeleton class="h-48 w-full" />
    </div>

    <template v-else-if="data">
      <div class="mb-5 grid gap-3 sm:grid-cols-3">
        <div
          v-for="row in summaryRows"
          :key="row.label"
          class="rounded-lg border border-default bg-default p-4 sm:p-5"
        >
          <p class="text-sm text-dimmed">
            {{ row.label }}
          </p>
          <p class="mt-1 text-3xl font-semibold text-highlighted">
            {{ row.value.toLocaleString('en-US') }}
          </p>
          <p class="mt-1 text-xs text-dimmed">
            {{ row.hint }}
          </p>
        </div>
      </div>

      <div class="mb-5 rounded-lg border border-default bg-default p-4 sm:p-5">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 class="font-semibold text-highlighted">
            Daily traffic
          </h2>
          <div class="flex items-center gap-4 text-xs text-dimmed">
            <span class="flex items-center gap-1.5">
              <span class="inline-block size-3 rounded-sm bg-primary opacity-60" /> Page views
            </span>
            <span class="flex items-center gap-1.5">
              <span class="inline-block h-0.5 w-4 rounded-sm bg-primary" /> Clicks
            </span>
          </div>
        </div>
        <figure
          class="w-full overflow-x-auto"
          :aria-label="`Daily page views and clicks for the last ${data.days} days`"
        >
          <svg
            role="img"
            :viewBox="`0 0 ${chart.width} ${chart.height}`"
            class="h-56 w-full min-w-120"
            preserveAspectRatio="none"
            aria-hidden="false"
          >
            <title>Daily page views (area) and clicks (line)</title>
            <path
              :d="chart.areaPath"
              class="fill-primary opacity-30"
            />
            <path
              :d="chart.linePath"
              class="stroke-primary"
              fill="none"
              stroke-width="2"
            />
            <g
              v-for="(point, index) in chart.daily"
              :key="point.date"
            >
              <rect
                :x="chart.x(index) - (chart.width - 20) / chart.count / 2"
                y="0"
                :width="(chart.width - 20) / chart.count"
                :height="chart.height"
                fill="transparent"
              >
                <title>{{ dayLabel(point.date) }}: {{ point.views }} views, {{ point.clicks }} clicks</title>
              </rect>
            </g>
          </svg>
          <figcaption class="sr-only">
            <table>
              <caption>Daily page views and clicks</caption>
              <thead>
                <tr>
                  <th scope="col">
                    Day
                  </th>
                  <th scope="col">
                    Views
                  </th>
                  <th scope="col">
                    Clicks
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="point in chart.daily"
                  :key="point.date"
                >
                  <th scope="row">
                    {{ dayLabel(point.date) }}
                  </th>
                  <td>{{ point.views }}</td>
                  <td>{{ point.clicks }}</td>
                </tr>
              </tbody>
            </table>
          </figcaption>
        </figure>
        <p class="mt-1 flex justify-between text-xs text-dimmed">
          <span>{{ dayLabel(chart.daily[0]?.date ?? '') }}</span>
          <span>{{ dayLabel(chart.daily[Math.floor((chart.daily.length - 1) / 2)]?.date ?? '') }}</span>
          <span>{{ dayLabel(chart.daily[chart.daily.length - 1]?.date ?? '') }}</span>
        </p>
      </div>

      <div class="grid gap-5 lg:grid-cols-2">
        <div class="rounded-lg border border-default bg-default p-4 sm:p-5">
          <h2 class="mb-3 font-semibold text-highlighted">
            Pages
          </h2>
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-dimmed">
                <th
                  scope="col"
                  class="pb-2 font-medium"
                >
                  Page
                </th>
                <th
                  scope="col"
                  class="pb-2 text-right font-medium"
                >
                  Views
                </th>
                <th
                  scope="col"
                  class="pb-2 text-right font-medium"
                >
                  Clicks
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default">
              <tr
                v-for="page in data.pages"
                :key="page.path"
              >
                <td class="py-2 pr-3 text-highlighted">
                  {{ pageLabel(page.path) }}
                </td>
                <td class="py-2 text-right text-highlighted">
                  {{ page.views.toLocaleString('en-US') }}
                </td>
                <td class="py-2 text-right text-highlighted">
                  {{ page.clicks.toLocaleString('en-US') }}
                </td>
              </tr>
              <tr v-if="!data.pages.length">
                <td
                  colspan="3"
                  class="py-3 text-dimmed"
                >
                  No traffic recorded yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="rounded-lg border border-default bg-default p-4 sm:p-5">
          <h2 class="mb-3 font-semibold text-highlighted">
            Referrers
          </h2>
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-dimmed">
                <th
                  scope="col"
                  class="pb-2 font-medium"
                >
                  Source
                </th>
                <th
                  scope="col"
                  class="pb-2 text-right font-medium"
                >
                  Views
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default">
              <tr
                v-for="referrer in data.referrers"
                :key="referrer.referrer"
              >
                <td class="py-2 pr-3 text-highlighted">
                  {{ referrer.referrer === 'direct' ? 'Direct / internal' : referrer.referrer }}
                </td>
                <td class="py-2 text-right text-highlighted">
                  {{ referrer.views.toLocaleString('en-US') }}
                </td>
              </tr>
              <tr v-if="!data.referrers.length">
                <td
                  colspan="2"
                  class="py-3 text-dimmed"
                >
                  No referrer data yet.
                </td>
              </tr>
            </tbody>
          </table>
          <p class="mt-3 text-xs text-dimmed">
            Only the external hostname is stored. Links from this site count as direct.
          </p>
        </div>

        <div class="rounded-lg border border-default bg-default p-4 sm:p-5">
          <h2 class="mb-1 font-semibold text-highlighted">
            Visitors by network address
          </h2>
          <p class="mb-3 text-xs text-dimmed">
            Addresses are kept for 7 days, then removed. Shown only as totals here — never
            combined with the pages a visitor opened.
          </p>
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-dimmed">
                <th
                  scope="col"
                  class="pb-2 font-medium"
                >
                  Address
                </th>
                <th
                  scope="col"
                  class="pb-2 text-right font-medium"
                >
                  Views
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default">
              <tr
                v-for="visitor in data.ips"
                :key="visitor.ip"
              >
                <td class="py-2 pr-3 font-mono text-xs text-highlighted">
                  {{ visitor.ip }}
                </td>
                <td class="py-2 text-right text-highlighted">
                  {{ visitor.views.toLocaleString('en-US') }}
                </td>
              </tr>
              <tr v-if="!data.ips.length">
                <td
                  colspan="2"
                  class="py-3 text-dimmed"
                >
                  No recent addresses. Unknown or expired after 7 days.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="rounded-lg border border-default bg-default p-4 sm:p-5">
          <div class="mb-1 flex flex-wrap items-center justify-between gap-2">
            <h2 class="font-semibold text-highlighted">
              Article SEO
            </h2>
            <UButton
              :to="data.seo.sitemapPath"
              target="_blank"
              color="neutral"
              variant="ghost"
              size="sm"
              label="View sitemap"
              trailing-icon="i-lucide-external-link"
            />
          </div>
          <p class="mb-3 text-xs text-dimmed">
            These checks only cover the explicit SEO fields in the editor. Published pages fall
            back to the title, excerpt and cover image, so empty fields are a refinement, not an
            error. No search ranking data is shown here.
          </p>
          <div
            v-if="seoCounts.total"
            class="mb-3 flex flex-wrap gap-2"
          >
            <UBadge
              color="warning"
              variant="soft"
            >
              {{ seoCounts.total }} article{{ seoCounts.total === 1 ? '' : 's' }} with gaps
            </UBadge>
            <UBadge
              v-if="seoCounts.seoTitle"
              color="neutral"
              variant="soft"
            >
              {{ seoCounts.seoTitle }} missing SEO title
            </UBadge>
            <UBadge
              v-if="seoCounts.metaDescription"
              color="neutral"
              variant="soft"
            >
              {{ seoCounts.metaDescription }} missing meta description
            </UBadge>
            <UBadge
              v-if="seoCounts.coverAlt"
              color="neutral"
              variant="soft"
            >
              {{ seoCounts.coverAlt }} missing cover alt text
            </UBadge>
          </div>
          <p
            v-else
            class="mb-3 text-sm text-dimmed"
          >
            Every published article has its SEO title, meta description and cover alt text filled in.
          </p>
          <ul
            v-if="seoCounts.total"
            class="divide-y divide-default"
          >
            <li
              v-for="check in data.seo.checks"
              :key="check.id"
              class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2"
            >
              <div class="min-w-0">
                <p class="truncate text-sm text-highlighted">
                  {{ check.title }}
                </p>
                <p class="text-xs text-dimmed">
                  {{ [
                    check.missingSeoTitle ? 'SEO title' : null,
                    check.missingMetaDescription ? 'meta description' : null,
                    check.missingCoverAlt ? 'cover alt text' : null
                  ].filter(Boolean).join(' · ') }} missing
                </p>
              </div>
              <UButton
                :to="`/${code}/articles/${check.id}`"
                color="neutral"
                variant="ghost"
                size="sm"
                label="Edit"
                trailing-icon="i-lucide-pencil-line"
              />
            </li>
          </ul>
        </div>
      </div>
    </template>
  </section>
</template>
