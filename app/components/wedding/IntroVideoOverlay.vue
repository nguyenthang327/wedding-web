<script setup lang="ts">
const emit = defineEmits<{
  complete: []
  'start-music': []
}>()

const { t } = useI18n()
const videoElement = ref<HTMLVideoElement | null>(null)
const isComplete = ref(false)
const isExiting = ref(false)
const hasStarted = ref(false)
const prefersReducedMotion = ref(false)
let exitTimer: ReturnType<typeof setTimeout> | undefined

const finishIntro = () => {
  if (isComplete.value) {
    return
  }

  isComplete.value = true
  document.body.classList.remove('has-intro-video')
  emit('complete')
}

const completeIntro = () => {
  if (isComplete.value || isExiting.value) {
    return
  }

  videoElement.value?.pause()

  if (prefersReducedMotion.value) {
    finishIntro()
    return
  }

  isExiting.value = true
  exitTimer = setTimeout(finishIntro, 850)
}

const startIntro = () => {
  const video = videoElement.value

  if (!video || isComplete.value || isExiting.value || hasStarted.value) {
    return
  }

  hasStarted.value = true
  void video.play().catch(() => {
    hasStarted.value = false
  })
  emit('start-music')
}

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion.value) {
    completeIntro()
    return
  }

  document.body.classList.add('has-intro-video')
})

onUnmounted(() => {
  if (exitTimer) {
    clearTimeout(exitTimer)
  }

  document.body.classList.remove('has-intro-video')
})
</script>

<template>
  <section class="intro-video-overlay" :class="{ 'is-exiting': isExiting }" aria-label="Wedding introduction">
    <button
      class="intro-video-overlay__trigger"
      type="button"
      :aria-label="t('intro.playAria')"
      @click="startIntro"
    >
      <video
        ref="videoElement"
        class="intro-video-overlay__media"
        src="/wedding/intro.mp4"
        muted
        playsinline
        preload="auto"
        @ended="completeIntro"
        @error="completeIntro"
      />
    </button>
  </section>
</template>
