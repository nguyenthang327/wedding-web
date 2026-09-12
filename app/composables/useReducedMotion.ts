export function useReducedMotion() {
  const prefersReducedMotion = useState<boolean>('prefers-reduced-motion', () => false)
  let mediaQuery: MediaQueryList | undefined

  const updatePreference = () => {
    prefersReducedMotion.value = Boolean(mediaQuery?.matches)
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
  })

  onUnmounted(() => {
    mediaQuery?.removeEventListener('change', updatePreference)
  })

  return prefersReducedMotion
}
