<script setup lang="ts">
import type { TimelineId } from '~/data/wedding'
import SectionHeading from '~/components/wedding/SectionHeading.vue'

const props = defineProps<{
  items: Array<{ id: TimelineId; time: string }>
}>()

const { t } = useI18n()
</script>

<template>
  <section id="schedule" class="schedule-section" aria-labelledby="schedule-title">
    <div class="section-inner">
      <SectionHeading
        eyebrow-key="schedule.eyebrow"
        title-key="schedule.title"
        title-id="schedule-title"
      />

      <div class="timeline" data-stagger>
        <article v-for="item in props.items" :key="item.id" class="timeline-item">
          <time>{{ item.time }}</time>
          <div>
            <h3>{{ t(`schedule.items.${item.id}.title`) }}</h3>
            <p>{{ t(`schedule.items.${item.id}.text`) }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
