<script setup lang="ts">
import { navServices, site } from '~/data/site'
</script>

<template>
  <footer
    id="contact"
    class="site-footer"
  >
    <div class="site-footer__inner">
      <div class="site-footer__brand">
        <img
          src="/images/logo-light-notext.svg"
          alt="Aubade Counselling"
          class="site-footer__logo"
          width="64"
          height="106"
        >
        <div class="site-footer__name">
          Aubade counselling
        </div>
        <p class="site-footer__tagline">
          Together , we’ll embrace the journey<br>to a brighter tomorrow !
        </p>
      </div>

      <div>
        <div class="site-footer__heading">
          Contact us
        </div>
        <div class="site-footer__rule" />
        <div class="site-footer__contact">
          <p>
            <a :href="site.phoneHref">{{ site.phone }}</a><br>
            <a :href="site.emailHref">{{ site.email }}</a>
          </p>
          <p>{{ site.address }}</p>
        </div>
      </div>

      <div>
        <div class="site-footer__heading">
          Services
        </div>
        <div class="site-footer__rule" />
        <nav
          class="site-footer__links"
          aria-label="Footer services"
        >
          <NuxtLink
            v-for="item in navServices"
            :key="item.to"
            :to="item.to"
          >{{ item.label }}</NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>
