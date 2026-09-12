export type CountdownParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const EMPTY_COUNTDOWN: CountdownParts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
}

export function useCountdown(targetIso: string) {
  const parts = ref<CountdownParts>({ ...EMPTY_COUNTDOWN })
  const hasStarted = ref(false)
  const isComplete = ref(false)
  let intervalId: number | undefined

  const update = () => {
    const remainingMs = new Date(targetIso).getTime() - Date.now()

    if (remainingMs <= 0) {
      parts.value = { ...EMPTY_COUNTDOWN }
      isComplete.value = true
      return
    }

    const totalSeconds = Math.floor(remainingMs / 1000)
    parts.value = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    }
    isComplete.value = false
  }

  onMounted(() => {
    hasStarted.value = true
    update()
    intervalId = window.setInterval(update, 1000)
  })

  onUnmounted(() => {
    if (intervalId) {
      window.clearInterval(intervalId)
    }
  })

  return {
    parts,
    hasStarted,
    isComplete
  }
}
