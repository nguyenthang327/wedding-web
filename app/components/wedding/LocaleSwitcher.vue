<script setup lang="ts">
const { locale, t, loadLocaleMessages } = useI18n()

const locales = ['en', 'vi'] as const
const isSwitching = ref(false)

const localeLabel = (language: typeof locales[number]) => t(`locale.options.${language}`)
const localeName = (language: typeof locales[number]) => t(`locale.names.${language}`)

const changeLocale = async (language: typeof locales[number]) => {
  if (language === locale.value || isSwitching.value) return

  isSwitching.value = true

  try {
    await loadLocaleMessages(language)
    locale.value = language
    await nextTick()

    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((target) => {
      target.classList.add('is-visible')
    })
  } finally {
    isSwitching.value = false
  }
}
</script>

<template>
  <nav class="locale-switcher" :aria-label="t('locale.ariaLabel')" :aria-busy="isSwitching">
    <button
      v-for="language in locales"
      :key="language"
      type="button"
      class="locale-switcher__option"
      :class="{ 'is-active': locale === language }"
      :aria-pressed="locale === language"
      :aria-label="locale === language ? localeName(language) : t('locale.switchTo', { name: localeName(language) })"
      :disabled="locale === language || isSwitching"
      @click="changeLocale(language)"
    >
      {{ localeLabel(language) }}
    </button>
  </nav>
</template>
