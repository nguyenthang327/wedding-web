<script setup lang="ts">
import IntroVideoOverlay from '~/components/wedding/IntroVideoOverlay.vue'
import InvitationScroll from '~/components/wedding/InvitationScroll.vue'
import BackgroundMusic from '~/components/wedding/BackgroundMusic.vue'

const { locale, localeProperties } = useI18n()
const isIntroComplete = ref(false)

const htmlLang = computed(() => String(localeProperties.value?.language || locale.value))

useHead({
  htmlAttrs: {
    lang: () => htmlLang.value
  },
  link: [
    {
      rel: 'preload',
      as: 'video',
      href: '/wedding/intro.mp4',
      type: 'video/mp4'
    }
  ]
})

useSeoMeta({
  title: 'Nguyen & Kim | Wedding Invitation',
  ogTitle: 'Nguyen & Kim | Wedding Invitation',
  description: 'Save the date for Nguyen and Kim on December 19th, 2026 at JW Marriott Hotel & Suites Saigon.',
  ogDescription: 'Join Nguyen and Kim in celebrating their wedding day on December 19th, 2026.',
  ogImage: '/wedding/assets/album-garden.jpg',
  twitterCard: 'summary_large_image'
})

useScrollReveal()
</script>

<template>
  <IntroVideoOverlay v-if="!isIntroComplete" @complete="isIntroComplete = true" />
  <main class="page-shell" :inert="!isIntroComplete" :aria-hidden="!isIntroComplete || undefined">
    <InvitationScroll />
  </main>
  <BackgroundMusic />
</template>
