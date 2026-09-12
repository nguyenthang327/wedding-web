<script setup lang="ts">
import RsvpForm from '~/components/wedding/RsvpForm.vue'
import SectionHeading from '~/components/wedding/SectionHeading.vue'
import WishForm from '~/components/wedding/WishForm.vue'

const { t } = useI18n()
</script>

<template>
  <section id="rsvp" class="forms-section" aria-labelledby="forms-title">
    <div class="section-inner forms-layout">
      <div class="forms-section__copy">
        <SectionHeading
          eyebrow-key="forms.section.eyebrow"
          title-key="forms.section.title"
          copy-key="forms.section.copy"
          title-id="forms-title"
        />
        <p class="forms-section__note" data-reveal>{{ t('footer.line') }}</p>
      </div>

      <div class="forms-grid" data-stagger>
        <WishForm />
        <RsvpForm />
      </div>
    </div>
  </section>
</template>
