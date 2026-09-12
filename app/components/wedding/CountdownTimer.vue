<script setup lang="ts">
const props = defineProps<{
  targetIso: string
}>()

const { t } = useI18n()
const { parts, hasStarted, isComplete } = useCountdown(props.targetIso)

const units = computed(() => [
  { key: 'days', value: parts.value.days },
  { key: 'hours', value: parts.value.hours },
  { key: 'minutes', value: parts.value.minutes },
  { key: 'seconds', value: parts.value.seconds }
])

const formatUnit = (value: number) => String(value).padStart(2, '0')
</script>

<template>
  <section class="countdown-card" :aria-label="t('countdown.ariaLabel')" data-reveal>
    <p class="countdown-card__status" aria-live="polite">
      {{ isComplete ? t('countdown.complete') : t('countdown.ariaLabel') }}
    </p>

    <div class="countdown-grid">
      <div v-for="unit in units" :key="unit.key" class="countdown-unit">
        <strong>{{ hasStarted ? formatUnit(unit.value) : '--' }}</strong>
        <span>{{ t(`countdown.units.${unit.key}`) }}</span>
      </div>
    </div>
  </section>
</template>
