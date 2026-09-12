export function useScrollReveal() {
  const prefersReducedMotion = useReducedMotion()
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const staggerTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-stagger]'))

    for (const parent of staggerTargets) {
      const revealType = parent.dataset.stagger || ''
      const staggerBase = Number(parent.dataset.staggerBase || 0)
      const staggerStep = Number(parent.dataset.staggerStep || 58)
      const staggerMax = Number(parent.dataset.staggerMax || 360)

      Array.from(parent.children).forEach((child, index) => {
        if (!(child instanceof HTMLElement)) {
          return
        }

        child.dataset.reveal = child.dataset.reveal || revealType

        if (!child.style.getPropertyValue('--reveal-delay')) {
          child.style.setProperty('--reveal-delay', `${Math.min(staggerBase + index * staggerStep, staggerBase + staggerMax)}ms`)
        }
      })
    }

    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!revealTargets.length) {
      return
    }

    const reduced = prefersReducedMotion.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || !('IntersectionObserver' in window)) {
      revealTargets.forEach((target) => target.classList.add('is-visible'))
      return
    }

    document.documentElement.classList.add('reveal-ready')

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue
          }

          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.12
      }
    )

    requestAnimationFrame(() => {
      revealTargets.forEach((target) => observer?.observe(target))
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
    document.documentElement.classList.remove('reveal-ready')
  })
}
