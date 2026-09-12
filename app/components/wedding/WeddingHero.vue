<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import type { WeddingImage } from '~/data/wedding'

defineProps<{
  image: WeddingImage
}>()

const { t } = useI18n()
</script>

<template>
  <section id="top" class="hero-section" aria-labelledby="hero-title">
    <img
      class="hero-image"
      :src="image.src"
      :alt="t('hero.imageAlt')"
      :width="image.width"
      :height="image.height"
      :style="{ objectPosition: image.objectPosition }"
      fetchpriority="high"
    >
    <div class="hero-shade" aria-hidden="true" />

    <div class="hero-content" data-reveal>
      <p class="eyebrow">{{ t('hero.eyebrow') }}</p>
      <h1 id="hero-title">{{ t('hero.title') }}</h1>
      <p class="hero-copy">
        {{ t('hero.subtitle') }}
      </p>

      <div class="hero-actions">
        <a class="button button--primary" href="#rsvp">
          {{ t('hero.primaryAction') }}
          <ChevronRight aria-hidden="true" />
        </a>
        <a class="button button--secondary" href="#details">
          {{ t('hero.secondaryAction') }}
        </a>
      </div>
    </div>
  </section>
</template>
