<script setup lang="ts">
const { locale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const localeCodes = ['vi', 'en'] as const
</script>

<template>
  <div class="locale-switcher" :aria-label="t('locale.ariaLabel')" role="group">
    <NuxtLink
      v-for="code in localeCodes"
      :key="code"
      class="locale-switcher__link"
      :class="{ 'is-active': locale === code }"
      :to="switchLocalePath(code)"
      :aria-current="locale === code ? 'true' : undefined"
      :aria-label="t('locale.switchTo', { name: t(`locale.options.${code}`) })"
    >
      {{ t(`locale.options.${code}`) }}
    </NuxtLink>
  </div>
</template>
