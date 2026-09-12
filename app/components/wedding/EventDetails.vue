<script setup lang="ts">
import { Calendar, Clock, ExternalLink, MapPin } from '@lucide/vue'
import type { DetailId } from '~/data/wedding'

const props = defineProps<{
  items: Array<{ id: DetailId; icon: 'calendar' | 'clock' | 'map' }>
  mapUrl: string
}>()

const { t } = useI18n()

const iconMap = {
  calendar: Calendar,
  clock: Clock,
  map: MapPin
}
</script>

<template>
  <section id="details" class="details-band" :aria-label="t('details.ariaLabel')">
    <div class="section-inner details-grid" data-stagger>
      <article v-for="item in props.items" :key="item.id" class="detail-card">
        <component :is="iconMap[item.icon]" class="detail-card__icon" aria-hidden="true" />
        <p>{{ t(`details.items.${item.id}.label`) }}</p>
        <h2>{{ t(`details.items.${item.id}.value`) }}</h2>
        <span>{{ t(`details.items.${item.id}.note`) }}</span>
        <a
          v-if="item.id === 'venue'"
          class="detail-card__link"
          :href="props.mapUrl"
          target="_blank"
          rel="noreferrer"
        >
          {{ t('details.items.venue.mapAction') }}
          <ExternalLink aria-hidden="true" />
        </a>
      </article>
    </div>
  </section>
</template>
