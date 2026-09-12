<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    eyebrowKey: string
    titleKey: string
    copyKey?: string
    titleId?: string
    align?: 'start' | 'center'
  }>(),
  {
    copyKey: undefined,
    titleId: undefined,
    align: 'start'
  }
)

const { t } = useI18n()
</script>

<template>
  <div class="section-heading" :class="`section-heading--${props.align}`" data-reveal>
    <p class="eyebrow">{{ t(props.eyebrowKey) }}</p>
    <h2 :id="props.titleId">{{ t(props.titleKey) }}</h2>
    <p v-if="props.copyKey" class="section-heading__copy">
      {{ t(props.copyKey) }}
    </p>
  </div>
</template>
