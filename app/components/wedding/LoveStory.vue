<script setup lang="ts">
import type { StoryId } from '~/data/wedding'
import SectionHeading from '~/components/wedding/SectionHeading.vue'

const props = defineProps<{
  items: StoryId[]
}>()

const { t } = useI18n()
</script>

<template>
  <section id="story" class="story-section" aria-labelledby="story-title">
    <div class="section-inner story-layout">
      <SectionHeading
        eyebrow-key="story.eyebrow"
        title-key="story.title"
        copy-key="story.copy"
        title-id="story-title"
      />

      <div class="story-list" data-stagger>
        <article v-for="item in props.items" :key="item" class="story-item">
          <h3>{{ t(`story.items.${item}.title`) }}</h3>
          <p>{{ t(`story.items.${item}.text`) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
