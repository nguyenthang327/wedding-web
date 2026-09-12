<script setup lang="ts">
import { ChevronLeft, ChevronRight, X } from '@lucide/vue'
import type { WeddingImage } from '~/data/wedding'
import SectionHeading from '~/components/wedding/SectionHeading.vue'

const props = defineProps<{
  images: WeddingImage[]
}>()

const { t } = useI18n()

const currentIndex = ref<number | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)

const currentImage = computed(() => {
  if (currentIndex.value === null) {
    return null
  }

  return props.images[currentIndex.value] || null
})

const openImage = async (index: number) => {
  currentIndex.value = index
  await nextTick()
  closeButton.value?.focus()
}

const closeImage = () => {
  currentIndex.value = null
}

const showPrevious = () => {
  if (currentIndex.value === null) {
    return
  }

  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

const showNext = () => {
  if (currentIndex.value === null) {
    return
  }

  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const onKeydown = (event: KeyboardEvent) => {
  if (currentIndex.value === null) {
    return
  }

  if (event.key === 'Escape') {
    closeImage()
  }

  if (event.key === 'ArrowLeft') {
    showPrevious()
  }

  if (event.key === 'ArrowRight') {
    showNext()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <section id="album" class="album-section" aria-labelledby="album-title">
    <div class="section-inner">
      <SectionHeading
        eyebrow-key="album.eyebrow"
        title-key="album.title"
        copy-key="album.copy"
        title-id="album-title"
        align="center"
      />

      <div class="album-grid" data-stagger>
        <button
          v-for="(image, index) in props.images"
          :key="image.id"
          class="album-item"
          type="button"
          :aria-label="t('album.openImage', { index: index + 1 })"
          @click="openImage(index)"
        >
          <img
            :src="image.src"
            :alt="t(`album.items.${image.id}`)"
            :width="image.width"
            :height="image.height"
            :style="{ objectPosition: image.objectPosition }"
            loading="lazy"
          >
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="currentImage"
        class="lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="t('album.ariaLabel')"
        @click.self="closeImage"
      >
        <div class="lightbox__toolbar">
          <p>
            {{ t('album.counter', { current: (currentIndex || 0) + 1, total: props.images.length }) }}
          </p>
          <button ref="closeButton" class="icon-button" type="button" :aria-label="t('album.close')" @click="closeImage">
            <X aria-hidden="true" />
          </button>
        </div>

        <button class="icon-button lightbox__nav lightbox__nav--prev" type="button" :aria-label="t('album.previous')" @click="showPrevious">
          <ChevronLeft aria-hidden="true" />
        </button>

        <img
          class="lightbox__image"
          :src="currentImage.src"
          :alt="t(`album.items.${currentImage.id}`)"
          :width="currentImage.width"
          :height="currentImage.height"
          :style="{ objectPosition: currentImage.objectPosition }"
        >

        <button class="icon-button lightbox__nav lightbox__nav--next" type="button" :aria-label="t('album.next')" @click="showNext">
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </Teleport>
  </section>
</template>
