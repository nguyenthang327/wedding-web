<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <footer class="wedding-footer">
    <div class="section-inner wedding-footer__inner" data-reveal>
      <p>{{ t('footer.line') }}</p>
      <strong>{{ t('footer.thanks') }}</strong>
    </div>
  </footer>
</template>
