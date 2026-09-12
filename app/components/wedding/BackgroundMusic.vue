<script setup lang="ts">
import { Music, Volume2, VolumeX } from '@lucide/vue'

const { t } = useI18n()
const audioElement = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const hasLoadError = ref(false)
// Keep this runtime URL dynamic so the optional, user-supplied file in public/ is not bundled.
const musicSource = '/wedding/' + 'cant-help-falling-in-love.mp3'

const startPlayback = async (showLoadError = false) => {
  const audio = audioElement.value

  if (!audio) {
    return
  }

  try {
    await audio.play()
  } catch {
    // Browsers may reject unmuted autoplay; keep the visible control as the fallback.
    if (showLoadError) {
      hasLoadError.value = true
    }
  }
}

const togglePlayback = async () => {
  const audio = audioElement.value

  if (!audio) {
    return
  }

  hasLoadError.value = false

  if (isPlaying.value) {
    audio.pause()
    return
  }

  await startPlayback(true)
}

onMounted(() => {
  if (!audioElement.value) {
    return
  }

  audioElement.value.volume = 0.35
  void startPlayback()
})
</script>

<template>
  <aside class="background-music" aria-live="polite">
    <audio
      ref="audioElement"
      :src="musicSource"
      autoplay
      loop
      preload="none"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @error="hasLoadError = true"
    />

    <button
      class="background-music__toggle"
      type="button"
      :aria-label="isPlaying ? t('music.pauseAria') : t('music.playAria')"
      :aria-pressed="isPlaying"
      @click="togglePlayback"
    >
      <Volume2 v-if="isPlaying" aria-hidden="true" />
      <VolumeX v-else aria-hidden="true" />
      <span>{{ isPlaying ? t('music.pause') : t('music.play') }}</span>
      <Music class="background-music__note" aria-hidden="true" />
    </button>

    <p v-if="hasLoadError" class="background-music__error" role="status">
      {{ t('music.loadError') }}
    </p>
  </aside>
</template>

<style scoped>
.background-music {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  z-index: 30;
  display: grid;
  justify-items: end;
  gap: 0.5rem;
}

.background-music__toggle {
  min-width: 7.75rem;
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.625rem 0.875rem;
  border: 1px solid rgba(41, 63, 56, 0.28);
  border-radius: 999px;
  background: rgba(255, 253, 247, 0.94);
  color: #293f38;
  box-shadow: 0 0.5rem 1.5rem rgba(35, 51, 45, 0.17);
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
}

.background-music__toggle:hover {
  background: #fff;
  box-shadow: 0 0.75rem 1.75rem rgba(35, 51, 45, 0.22);
  transform: translateY(-2px);
}

.background-music__toggle:focus-visible {
  outline: 3px solid #8caf9b;
  outline-offset: 3px;
}

.background-music__toggle :deep(svg) {
  width: 1rem;
  height: 1rem;
  flex: none;
}

.background-music__note {
  opacity: 0.65;
}

.background-music__error {
  max-width: 13.5rem;
  margin: 0;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: rgba(255, 253, 247, 0.96);
  color: #6b3030;
  box-shadow: 0 0.5rem 1.25rem rgba(35, 51, 45, 0.14);
  font-size: 0.75rem;
}

@media (prefers-reduced-motion: reduce) {
  .background-music__toggle {
    transition: none;
  }
}
</style>
