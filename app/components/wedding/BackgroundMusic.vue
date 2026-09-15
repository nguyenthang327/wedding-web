<script setup lang="ts">
import { Volume2, VolumeX } from '@lucide/vue'

const { t } = useI18n()
const audioElement = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const hasLoadError = ref(false)
// Keep this runtime URL dynamic so the optional, user-supplied file in public/ is not bundled.
const musicSource = '/wedding/' + 'cant-help-falling-in-love.mp3'

const startPlayback = async (showLoadError = false) => {
  const audio = audioElement.value

  if (!audio) {
    return false
  }

  try {
    await audio.play()
    return true
  } catch {
    // Keep the visible control as the fallback if media playback fails.
    if (showLoadError) {
      hasLoadError.value = true
    }

    return false
  }
}

const syncPlaybackState = () => {
  const audio = audioElement.value

  if (audio) {
    isPlaying.value = !audio.paused && !audio.ended && !audio.muted && audio.volume > 0
  }
}

const togglePlayback = async () => {
  const audio = audioElement.value

  if (!audio) {
    return
  }

  hasLoadError.value = false

  // Read the media element's state directly. The `play` event is async, so
  // `isPlaying` can still be false when a quick tap reaches this handler.
  const isAudible = !audio.paused && !audio.muted && audio.volume > 0

  if (isAudible) {
    audio.pause()
    return
  }

  restoreAudibleSettings()
  await startPlayback(true)
}

const handlePlaybackStarted = () => {
  syncPlaybackState()
}

const restoreAudibleSettings = () => {
  const audio = audioElement.value

  if (!audio) {
    return
  }

  audio.volume = 0.35
  audio.muted = false
}

const startFromIntro = async () => {
  hasLoadError.value = false
  restoreAudibleSettings()
  await startPlayback(true)
}

defineExpose({ startFromIntro })

onMounted(() => {
  if (!audioElement.value) {
    return
  }

  audioElement.value.volume = 0.35
  syncPlaybackState()
})

</script>

<template>
  <aside class="background-music" aria-live="polite">
    <audio
      ref="audioElement"
      :src="musicSource"
      loop
      preload="none"
      @play="handlePlaybackStarted"
      @playing="syncPlaybackState"
      @pause="syncPlaybackState"
      @volumechange="syncPlaybackState"
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
  bottom: calc(max(1rem, env(safe-area-inset-bottom)) + 46px + 0.5rem);
  z-index: 30;
  display: grid;
  justify-items: end;
  gap: 0.5rem;
}

.background-music__toggle {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid rgba(41, 63, 56, 0.28);
  border-radius: 50%;
  background: rgba(255, 253, 247, 0.94);
  color: #293f38;
  box-shadow: 0 0.5rem 1.5rem rgba(35, 51, 45, 0.17);
  font: inherit;
  cursor: pointer;
  transition: transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
}

.background-music__toggle:hover {
  background: #fff;
  box-shadow: 0 0.75rem 1.75rem rgba(35, 51, 45, 0.22);
  transform: translateY(-2px);
}

.background-music__toggle:active {
  transform: scale(0.95);
}

.background-music__toggle:focus-visible {
  outline: 3px solid #8caf9b;
  outline-offset: 3px;
}

.background-music__toggle :deep(svg) {
  width: 1.15rem;
  height: 1.15rem;
  flex: none;
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
