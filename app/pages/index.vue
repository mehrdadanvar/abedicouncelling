<script setup lang="ts">
import { homeServices, howItWorks, site, testimonials, whyAubade } from '~/data/site'
import { posts } from '~/data/posts'

const activeTestimonial = ref(0)
const activeQuote = computed(() => testimonials[activeTestimonial.value]!.quote)

useSeoMeta({
  title: 'Aubade Counselling - aubade counselling | North Vancouver',
  description: 'You have within you the strength to heal. I’m here to offer compassionate guidance, standing with you every step of the way. With each step, we’ll uncover your strength and move toward a life of peace and renewed hope | North Vancouver',
  ogTitle: 'Aubade Counselling - aubade counselling | North Vancouver',
  ogDescription: 'You have within you the strength to heal. I’m here to offer compassionate guidance, standing with you every step of the way. With each step, we’ll uncover your strength and move toward a life of peace and renewed hope | North Vancouver',
  ogImage: '/images/home-hero.webp',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div>
    <section class="home-hero">
      <div class="home-hero__row">
        <div class="home-hero__copy">
          <div class="eyebrow">
            AUBADE COUNSELLING
          </div>
          <h1>Walking Beside You Toward Healing</h1>
          <hr class="hero-rule">
          <p>You have within you the strength to heal. I’m here to offer compassionate guidance, standing with you every step of the way. With each step, we’ll uncover your strength and move toward a life of peace and renewed hope</p>
          <BaseButton
            :to="site.booking"
            variant="olive"
          >
            Book An Appointment
          </BaseButton>
        </div>
        <div class="home-hero__media">
          <img
            src="/images/home-hero.webp"
            alt="Nazanin Zarei standing in a field with mountains behind her"
            width="854"
            height="1280"
            fetchpriority="high"
          >
        </div>
      </div>
    </section>

    <section class="home-services">
      <div class="home-services__head">
        <div class="eyebrow eyebrow--gold">
          Your Path to Wellness
        </div>
        <h2>In depth Therapy for Individuals , Couples and Families</h2>
        <p>Specializing in guiding individuals, couples, and families to break free from the past and embrace a healthier, more meaningful future</p>
      </div>

      <div class="services-grid">
        <ServiceCard
          v-for="service in homeServices"
          :key="service.title"
          v-bind="service"
        />
      </div>

      <div class="home-services__cta">
        <BaseButton
          :to="site.booking"
          variant="olive"
        >
          Book An Appointment
        </BaseButton>
      </div>
    </section>

    <section class="home-about">
      <div class="home-about__row">
        <div class="home-about__media">
          <img
            src="/images/home-about.webp"
            alt="Nazanin Zarei smiling in a field"
            width="510"
            height="783"
            loading="lazy"
          >
        </div>
        <div class="home-about__copy">
          <img
            src="/images/logo.svg"
            alt=""
            class="home-about__logo"
            width="90"
            height="80"
            aria-hidden="true"
          >
          <h2>I’m Nazanin Zarei</h2>
          <hr class="hero-rule">
          <p>With around a decade of experience in the field of mental health, working across diverse clinical and non-clinical settings, my journey has been enriched by countless stories of resilience and transformation, each deepening my empthy and insight.<br>I offer therapy grounded in evidence based approaches and tools. My clients leave leave our sessions feel validated, supported and empowered. I invite you to take the first step on your healing journey . Don’t hesitate to reach out and schedule your free consultation with me today!</p>
          <BaseButton
            to="/nazanin-zarei"
            variant="olive"
          >
            More About Nazanin
          </BaseButton>
        </div>
      </div>
    </section>

    <section class="testimonial-section">
      <div class="testimonial-slider">
        <div class="testimonial-slider__quote">
          <p>{{ activeQuote }}</p>
        </div>
        <BaseButton
          :to="site.booking"
          variant="white"
        >
          Book An Appointment
        </BaseButton>
        <div
          class="testimonial-slider__dots"
          aria-label="Testimonials"
        >
          <button
            v-for="(_, index) in testimonials"
            :key="index"
            type="button"
            class="testimonial-slider__dot"
            :class="{ 'is-active': activeTestimonial === index }"
            :aria-label="`Testimonial ${index + 1}`"
            :aria-pressed="activeTestimonial === index"
            @click="activeTestimonial = index"
          />
        </div>
      </div>
    </section>

    <section class="why-section">
      <div class="why-section__inner">
        <div class="why-section__head">
          <h2>Why AUBADE COUNSELLING</h2>
          <p>Taking the step into therapy is like opening the door to a new chapter in your life. Here’s what you can expect as we embark on this healing journey together:</p>
        </div>

        <div class="why-section__grid">
          <BaseAccordion
            :items="whyAubade.left"
            variant="cards"
            :default-open="0"
          />
          <BaseAccordion
            :items="whyAubade.right"
            variant="cards"
            :default-open="0"
          />
        </div>
      </div>
    </section>

    <section class="home-blog">
      <h2>My Blog</h2>
      <div class="home-blog__grid">
        <BlogCard
          v-for="post in posts.slice(0, 3)"
          :key="post.slug"
          :post="post"
        />
      </div>
    </section>

    <section class="how-section">
      <div class="how-section__inner">
        <div class="how-section__head">
          <div class="eyebrow eyebrow--sarabun">
            AUBADE COUNSELLING
          </div>
          <h2>How it works:</h2>
        </div>
        <BaseAccordion
          :items="howItWorks"
          variant="lines"
          :default-open="0"
        />
      </div>
    </section>
  </div>
</template>
