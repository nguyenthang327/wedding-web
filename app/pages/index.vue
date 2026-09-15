<script setup lang="ts">
import IntroVideoOverlay from '~/components/wedding/IntroVideoOverlay.vue'
import InvitationScroll from '~/components/wedding/InvitationScroll.vue'
import BackgroundMusic from '~/components/wedding/BackgroundMusic.vue'
import LocaleSwitcher from '~/components/wedding/LocaleSwitcher.vue'

const { locale, localeProperties, t } = useI18n()
const isIntroComplete = ref(false)
const backgroundMusic = ref<{ startFromIntro: () => Promise<void> } | null>(null)

const startBackgroundMusic = () => {
  void backgroundMusic.value?.startFromIntro()
}

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
  title: () => t('seo.title'),
  ogTitle: () => t('seo.title'),
  description: () => t('seo.description'),
  ogDescription: () => t('seo.ogDescription'),
  ogImage: '/wedding/assets/album-garden.jpg',
  twitterCard: 'summary_large_image'
})

useScrollReveal()
</script>

<template>
  <IntroVideoOverlay
    v-if="!isIntroComplete"
    @complete="isIntroComplete = true"
    @start-music="startBackgroundMusic"
  />
  <LocaleSwitcher class="page-locale-switcher" />
  <main
    class="page-shell"
    :class="{ 'is-intro-complete': isIntroComplete }"
    :inert="!isIntroComplete"
    :aria-hidden="!isIntroComplete || undefined"
  >
    <InvitationScroll />
  </main>
  <BackgroundMusic ref="backgroundMusic" />
</template>
