<script setup lang="ts">
const { locale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const targetLocale = computed(() => locale.value === 'vi' ? 'en' : 'vi')
const targetLocalePath = computed(() => switchLocalePath(targetLocale.value))
const targetLocaleLabel = computed(() => t(`locale.options.${targetLocale.value}`))
const targetLocaleName = computed(() => t(`locale.names.${targetLocale.value}`))
</script>

<template>
  <NuxtLink
    class="locale-switcher"
    :to="targetLocalePath"
    :aria-label="t('locale.switchTo', { name: targetLocaleName })"
  >
    {{ targetLocaleLabel }}
  </NuxtLink>
</template>
