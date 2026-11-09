<script setup lang="ts">
import { services } from '~/data/services'
import { site } from '~/data/site'

const props = defineProps<{ slug: keyof typeof services }>()
const service = computed(() => services[props.slug]!)

useSeoMeta({
  title: service.value.seoTitle,
  description: service.value.description,
  ogTitle: service.value.seoTitle,
  ogDescription: service.value.description,
  ogImage: service.value.heroImage,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div>
    <section class="service-main">
      <div class="service-hero">
        <div class="service-hero__row">
          <div class="service-hero__copy">
            <h1>{{ service.title }}</h1>
            <template
              v-for="(paragraph, index) in service.paragraphs"
              :key="paragraph"
            >
              <p>{{ paragraph }}</p>
              <ul v-if="index === 0 && service.bullets">
                <li
                  v-for="bullet in service.bullets"
                  :key="bullet"
                >
                  {{ bullet }}
                </li>
              </ul>
            </template>
            <BaseButton
              :to="site.booking"
              variant="olive"
            >
              Book An Appointment
            </BaseButton>
          </div>
          <div class="service-hero__media">
            <img
              :src="service.heroImage"
              :alt="service.heroImageAlt"
              width="1024"
              height="1280"
              fetchpriority="high"
            >
          </div>
        </div>
      </div>

      <FlowerDivider />

      <div
        v-for="block in service.blocks"
        :key="block.image"
        class="service-block"
        :class="{ 'service-block--media-left': block.imageSide === 'left' }"
      >
        <div class="service-block__content">
          <h2 v-if="block.heading">
            {{ block.heading }}
          </h2>
          <BaseAccordion
            :items="block.items"
            variant="lines"
            :default-open="0"
            chevron="right"
          />
        </div>
        <div class="service-block__media">
          <img
            :src="block.image"
            :alt="block.imageAlt"
            loading="lazy"
          >
        </div>
      </div>
    </section>

    <section
      class="approaches"
      :class="{ 'approaches--family': service.slug === 'family' }"
    >
      <div :class="service.slug === 'family' ? 'site-wrap' : 'site-wrap--approaches'">
        <h2>{{ service.approachTitle }}</h2>
      </div>

      <ApproachGrid v-if="service.slug !== 'family'" />

      <div
        v-else
        class="approach-card approach-card--family"
      >
        <h3>Emotion-Focused Family Therapy (EFFT)</h3>
        <p>I use Emotion-Focused Family Therapy (EFFT), a proven, evidence-based approach that supports families in healing and growing together. EFFT is built on the understanding that emotions lie at the heart of every family relationship:</p>
        <ul>
          <li>They can either bring us closer together or create distance and conflict.</li>
          <li>By identifying hidden emotions and patterns that may be driving tension, we can uncover the root causes of disconnection.</li>
          <li>Creating a Space for Empathy and Understanding</li>
        </ul>
        <BaseButton
          :to="site.booking"
          variant="light"
        >
          Book An Appointment
        </BaseButton>
      </div>
    </section>

    <section class="faq-section">
      <div class="faq-section__inner">
        <div class="faq-section__copy">
          <div class="eyebrow eyebrow--sarabun">
            {{ service.faq.eyebrow }}
          </div>
          <h2>{{ service.faq.title }}</h2>
          <p v-if="service.faq.body">
            {{ service.faq.body }}
          </p>
          <BaseButton
            :to="site.booking"
            variant="olive"
          >
            Book An Appointment
          </BaseButton>
        </div>
        <BaseAccordion
          :items="service.faq.items"
          variant="lines"
          :default-open="0"
          chevron="right"
        />
      </div>
    </section>
  </div>
</template>
