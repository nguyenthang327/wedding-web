<script setup lang="ts">
const props = defineProps<{
  year: number
  month: number
  day: number
}>()

const { t } = useI18n()

const weekdayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const calendarDays = computed(() => {
  const daysInMonth = new Date(Date.UTC(props.year, props.month, 0)).getUTCDate()
  const firstDay = new Date(Date.UTC(props.year, props.month - 1, 1)).getUTCDay()
  const mondayOffset = (firstDay + 6) % 7

  return [
    ...Array.from({ length: mondayOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1)
  ]
})
</script>

<template>
  <section class="calendar-card" :aria-label="t('calendar.ariaLabel')" data-reveal>
    <div class="calendar-card__header">
      <p class="eyebrow">{{ t('calendar.ariaLabel') }}</p>
      <h3>{{ t('calendar.monthName') }}</h3>
    </div>

    <div class="calendar-grid" role="grid" :aria-label="t('calendar.monthName')">
      <span
        v-for="weekday in weekdayKeys"
        :key="weekday"
        class="calendar-weekday"
        role="columnheader"
      >
        {{ t(`calendar.weekdays.${weekday}`) }}
      </span>

      <span
        v-for="(dayNumber, index) in calendarDays"
        :key="`${dayNumber || 'blank'}-${index}`"
        class="calendar-day"
        :class="{ 'is-selected': dayNumber === props.day }"
        role="gridcell"
        :aria-label="dayNumber === props.day ? t('calendar.selectedLabel') : undefined"
      >
        {{ dayNumber || '' }}
      </span>
    </div>
  </section>
</template>
