<script setup lang="ts">
import { site } from '~/data/site'

const artColumns = [
  [{ src: '/images/art-01.jpg', width: 960, height: 1280 }, { src: '/images/art-07.jpg', width: 764, height: 1065 }],
  [{ src: '/images/art-02.jpg', width: 783, height: 1083 }, { src: '/images/art-08.jpg', width: 1013, height: 836 }, { src: '/images/art-09.jpg', width: 1228, height: 717 }],
  [{ src: '/images/art-03.jpg', width: 822, height: 1072 }, { src: '/images/art-06.jpg', width: 912, height: 1062 }],
  [{ src: '/images/art-04.jpg', width: 1191, height: 799 }, { src: '/images/art-05.jpg', width: 725, height: 1130 }]
]

const whyLeft = [
  {
    title: 'Embracing Jungian Wisdom:',
    tone: 'green' as const,
    body: 'Early in my career, I was drawn to Jungian psychotherapy. This approach—with its focus on archetypes, patterns, and the unconscious—felt like coming home to a deep well of understanding. Over two decades, I immersed myself in Jungian concepts, teaching others and using these tools to explore the stories and symbols that shape our lives. Jungian therapy provided a rich foundation for my work, helping me appreciate the depth of human experience. But as my own journey continued, I discovered another approach that expanded my perspective and opened new doors: Emotion-Focused Therapy (EFT).'
  },
  {
    title: 'Discovering the Transformative Power of EFT',
    tone: 'light' as const,
    body: 'Emotion-Focused Therapy introduced me to a deeply experiential way of working with emotions. While Jungian therapy helped me uncover the roots of emotional patterns, EFT showed me how to transform them. It taught me that emotions are not just things to analyze but experiences to process and embrace fully. This approach has enriched my practice and deepened my commitment to helping clients move beyond understanding their past to creating meaningful change in the present. Alongside EFT, I’ve embraced other experiential modalities such as Internal Family Systems and Art Therapy, weaving them together to guide clients in exploring and transforming their emotional landscapes.'
  },
  {
    title: 'Commitment to Lifelong Learning',
    tone: 'light' as const,
    body: 'Counseling is more than a career to me—it’s a lifelong journey of growth. I firmly believe there’s always more to learn, and I’m passionate about continuing my professional development. I’m currently on the path to becoming a certified Emotion-Focused Therapist and feel honored to be directly supervised by Dr. Leslie Greenberg, a pioneer in the field. Each training, each new approach I study, and each client I meet teaches me something new about this work. For me, therapy is not just a space for clients to grow—it’s also a place where I grow alongside them, learning with curiosity, excitement, and openness to what unfolds.'
  }
]

const whyRight = [
  {
    title: 'What Clients Say About Our Work Together',
    tone: 'peach' as const,
    body: 'Clients often tell me that our sessions feel like talking to a trusted friend—someone who listens without judgment and truly understands. They describe the space we create as one of warmth, safety, and deep care. These reflections mean everything to me because they speak to the trust and connection we build together. Being part of someone’s journey is an incredible privilege, and every time a client feels supported and empowered, it reminds me why I love this work. Helping clients feel safe and understood is at the heart of everything I do.'
  },
  {
    title: 'Walking This Path Together',
    tone: 'light' as const,
    body: 'If you’re here, I want you to know that you don’t have to face your challenges alone. Therapy is a space where you can feel safe, supported, and understood. It’s not just about working through struggles; it’s about discovering new possibilities and building the life you want. Whatever you’re facing, I’m here to walk alongside you. Together, we’ll create a path forward, step by step, with compassion, hope, and courage. Let’s begin this journey together.'
  },
  {
    title: 'Gentle but Powerful Discovery',
    tone: 'light' as const,
    body: 'Through compassionate reflection and creative exploration, we’ll uncover the emotional patterns that have shaped your life. This isn’t just about talking—it’s about uncovering hidden strengths, healing old wounds, and finding new ways to move forward with intention.'
  }
]

useSeoMeta({
  title: 'About Us - aubade counselling',
  description: 'Hi, I’m Nazanin. My journey into the world of counseling began with my own life experiences. Like many of you, I’ve faced challenges—times of uncertainty,',
  ogTitle: 'About Us - aubade counselling',
  ogDescription: 'Hi, I’m Nazanin. My journey into the world of counseling began with my own life experiences. Like many of you, I’ve faced challenges—times of uncertainty,',
  ogImage: '/images/about-hero.jpg',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div>
    <div class="about-hero">
      <div class="about-hero__row">
        <div class="about-hero__copy">
          <h1>I’m Nazanin Zarei</h1>
          <p>Hi, I’m Nazanin. My journey into the world of counseling began with my own life experiences. Like many of you, I’ve faced challenges—times of uncertainty, pain, and searching for meaning. Those moments shaped me and taught me how much we all need connection and support to navigate life’s difficulties. They also planted the seed for my passion to help others. After earning my bachelor’s degree, I worked in diverse clinical and non-clinical settings with individuals from various walks of life.</p>
          <BaseButton
            :to="site.booking"
            variant="olive"
          >
            Book An Appointment
          </BaseButton>
        </div>
        <div class="about-hero__media">
          <img
            src="/images/about-hero.jpg"
            alt="Nazanin Zarei sitting on a chair in a field"
            width="854"
            height="1280"
            fetchpriority="high"
          >
        </div>
      </div>

      <FlowerDivider />

      <div class="education-section__row">
        <div>
          <h2>Education</h2>
          <hr class="heading-rule">
          <div class="education-section__copy">
            <p><strong>Education:</strong></p>
            <ul>
              <li>Master of Counseling Psychology and Art Therapy – Adler University</li>
              <li>Bachelor of Psychology and Visual Arts – University of British Columbia</li>
            </ul>
            <p><strong>Trainings &amp; Memberships:</strong></p>
            <ul>
              <li>Member of the International Society for Emotion Focused Therapy (ISEFT)</li>
              <li>Emotion-Focused Individual Therapy (Level 1 &amp; 2)</li>
              <li>Emotion-Focused Couple Therapy (Level 1 &amp; 2)</li>
              <li>Emotion-Focused Family Therapy (Level 1)</li>
              <li>Somatic &amp; Attachment Focused (S.A.F.E) EMDR</li>
              <li>Person-Centered Expressive Art Therapy</li>
              <li>Jungian Analytical Psychotherapy</li>
              <li>Grief Therapy Masterclass</li>
            </ul>
          </div>
        </div>
        <div class="education-section__media">
          <img
            src="/images/education.png"
            alt="A black book and red tassel beside a single red rose"
            width="1080"
            height="1350"
            loading="lazy"
          >
        </div>
      </div>
    </div>

    <section class="art-section">
      <div class="art-section__inner">
        <h2>Finding Solace and Strength in Art</h2>
        <hr class="heading-rule">
        <p class="art-section__copy">
          Art has always been an essential part of my life. During my toughest times, art became a refuge—a way to express feelings that words couldn’t capture. Whether I was painting, sketching, or creating, art gave me a safe space to process emotions and find healing. Those personal experiences showed me the profound power of creativity to transform pain into strength through art, helping me find clarity, comfort, and growth.
        </p>

        <div class="art-gallery">
          <div
            v-for="(column, index) in artColumns"
            :key="index"
            class="art-gallery__col"
          >
            <img
              v-for="image in column"
              :key="image.src"
              :src="image.src"
              :width="image.width"
              :height="image.height"
              alt=""
              loading="lazy"
            >
          </div>
        </div>

        <BaseButton
          :to="site.booking"
          variant="olive"
        >
          Book An Appointment
        </BaseButton>
      </div>
    </section>

    <section class="growing-section">
      <div class="growing-section__row">
        <div class="growing-section__media">
          <img
            src="/images/about-growing.jpg"
            alt="Nazanin Zarei standing in a field"
            width="854"
            height="1280"
            loading="lazy"
          >
        </div>
        <div class="growing-section__copy">
          <h2>Growing Through Every Story</h2>
          <p>After completing my master’s degree, I had the privilege of working with clients from all walks of life. I’ve supported adolescents navigating identity and relationships, adults seeking clarity and direction, and seniors reflecting on their life journeys. I’ve also worked with couples and families striving to strengthen their connections. Each client I’ve worked with has taught me something valuable about resilience, courage, and the unique beauty of every individual’s story. My earlier roles as an employment counselor, case manager, and coach also expanded my understanding of the diverse ways people face and overcome challenges. These experiences have helped me connect deeply with clients, understand their worlds, and guide them toward a path of hope and healing.</p>
          <BaseButton
            :to="site.booking"
            variant="olive"
          >
            Book An Appointment
          </BaseButton>
        </div>
      </div>

      <FlowerDivider />

      <div class="why-working">
        <div class="why-working__inner">
          <div class="why-working__head">
            <h2>Why Working With Me:</h2>
            <p>Taking the step into therapy is like opening the door to a new chapter in your life. Here’s what you can expect as we embark on this healing journey together:</p>
          </div>

          <div class="why-working__grid">
            <BaseAccordion
              :items="whyLeft"
              variant="cards"
              :default-open="0"
            />
            <BaseAccordion
              :items="whyRight"
              variant="cards"
              :default-open="0"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
