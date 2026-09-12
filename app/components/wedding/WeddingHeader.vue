<script setup lang="ts">
import { Heart } from '@lucide/vue'
import LocaleSwitcher from '~/components/wedding/LocaleSwitcher.vue'

const { t } = useI18n()

const navItems = [
  { id: 'story', href: '#story', key: 'nav.story' },
  { id: 'schedule', href: '#schedule', key: 'nav.schedule' },
  { id: 'album', href: '#album', key: 'nav.album' },
  { id: 'rsvp', href: '#rsvp', key: 'nav.rsvp' }
]
</script>

<template>
  <header class="site-header" :aria-label="t('nav.ariaLabel')">
    <a class="brand-mark" href="#top" :aria-label="t('nav.home')">
      <Heart class="brand-mark__icon" aria-hidden="true" />
      <span>{{ t('hero.title') }}</span>
    </a>

    <nav class="nav-links">
      <a v-for="item in navItems" :key="item.id" :href="item.href">
        {{ t(item.key) }}
      </a>
    </nav>

    <LocaleSwitcher />
  </header>
</template>
