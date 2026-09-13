<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import useEmblaCarousel from 'embla-carousel-vue'

type AttendanceValue = '' | 'yes' | 'no'
type GuestOfValue = '' | 'brideGroom' | 'brideParents' | 'groomParents'
type PlusOneValue = '' | 'yes' | 'no'

const defaultGuestOf: GuestOfValue = 'brideGroom'
const defaultAttendance: AttendanceValue = 'yes'
const defaultPlusOneAttendance: PlusOneValue = 'yes'
const guestOfEnglishLabels: Record<Exclude<GuestOfValue, ''>, string> = {
  brideGroom: 'The Bride & Groom',
  brideParents: "The Bride's Parents",
  groomParents: "The Groom's Parents"
}

const targetIso = '2026-12-19T17:30:00+07:00'
const { parts, hasStarted, isComplete } = useCountdown(targetIso)
const { locale, t } = useI18n()
const { state, errorKey, isLoading, reset, submit } = useSheetSubmit()

const calendarImageSrc = computed(() =>
  locale.value === 'vi' ? '/wedding/Asset%207@3x.png' : '/wedding/assets/calendar.png'
)

const countdownUnits = computed(() => [
  { key: 'days', value: parts.value.days, label: t('invite.countdown.units.days') },
  { key: 'hours', value: parts.value.hours, label: t('invite.countdown.units.hours') },
  { key: 'minutes', value: parts.value.minutes, label: t('invite.countdown.units.minutes') },
  { key: 'seconds', value: parts.value.seconds, label: t('invite.countdown.units.seconds') }
])

const timelineItems = computed(() => [
  { time: '17:30', title: t('invite.timeline.events.welcome') },
  { time: '18:30', title: t('invite.timeline.events.ceremony') },
  { time: '19:00', title: t('invite.timeline.events.reception') },
  { time: '20:00', title: t('invite.timeline.events.entertainment') },
  { time: '21:00', title: t('invite.timeline.events.afterParty') },
  { time: '22:00', title: t('invite.timeline.events.goodbye') }
])

const dressColors = [
  { key: 'royalBlue', color: '#265391' },
  { key: 'sageGreen', color: '#bed5ab' },
  { key: 'dustyMauve', color: '#cca7bc' },
  { key: 'butterYellow', color: '#f3dfa9' },
  { key: 'lightBlue', color: '#b7e2f8' },
  { key: 'lightPink', color: '#ffd4df' },
  { key: 'warmBeige', color: '#ded5c8' }
]

const albumImageFiles = [
  '9.jpg',
  '12.jpg',
  'KIMANDY-23.jpg',
  'KIMANDY-24.jpg',
  'KIMANDY-33.jpg',
  'KIMANDY-38.jpg',
  'KIMANDY-46.jpg',
  'KIMANDY-47.jpg',
  'KIMANDY-49.jpg',
  'KIMANDY-58.jpg',
  'KIMANDY-62.jpg',
  'KIMANDY-76.jpg',
  'KIMANDY-77.jpg',
  'KIMANDY-88.jpg',
  'KIMANDY-94.jpg',
  'KIMANDY-99.jpg',
  'KIMANDY-101.jpg',
  'KIMANDY-110.jpg',
  'KIMANDY-111.jpg',
  'KIMANDY-120.jpg',
  'KIMANDY-124.jpg',
  'KIMANDY-125.jpg',
  'KIMANDY-126.jpg',
  'KIMANDY-142.jpg',
  'KIMANDY-147.jpg',
  'KIMANDY-148.jpg',
  'KIMANDY-152 (1).jpg',
  'KIMANDY-152.jpg',
  'KIMANDY-153.jpg',
  'KIMANDY-159.jpg',
  'KIMANDY-168.jpg',
  'KIMANDY-175.jpg',
  'KIMANDY-186.jpg',
  'KIMANDY-191.jpg',
  'KIMANDY-197.jpg',
  'KIMANDY-203.jpg',
  'KIMANDY-218.jpg',
  'KIMANDY-349.jpg',
  'KIMANDY-351.jpg',
  'KIMANDY-358.jpg',
  'KIMANDY-360.jpg',
  'KIMANDY-361.jpg',
  'KIMANDY-365.jpg',
  'KIMANDY-378.jpg',
  'KIMANDY-385.jpg',
  'KIMANDY-388.jpg',
  'KIMANDY-389.jpg',
  'KIMANDY-395.jpg',
  'KIMANDY-396.jpg',
  'KIMANDY-397.jpg',
  'KIMANDY-398.jpg',
  'KIMANDY-405.jpg',
  'KIMANDY-406.jpg',
  'KIMANDY-407.jpg',
  'KIMANDY-412.jpg',
  'KIMANDY-425.jpg',
  'KIMANDY-448.jpg',
  'KIMANDY-467.jpg',
  'KIMANDY-469.jpg',
  'KIMANDY-474.jpg',
  'KIMANDY-488.jpg',
  'KIMANDY-500.jpg',
  'KIMANDY-504.jpg',
  'KIMANDY-508.jpg',
  'KIMANDY-510.jpg',
  'KIMANDY-520.jpg',
  'KIMANDY-521.jpg',
  'KIMANDY-522.jpg',
  'KIMANDY-523.jpg',
  'KIMANDY-524.jpg',
  'KIMANDY-533.jpg',
  'KIMANDY-539.jpg',
  'KIMANDY-540.jpg',
  'KIMANDY-541.jpg',
  'KIMANDY-542.jpg',
  'KIMANDY-543 (1).jpg',
  'KIMANDY-543.jpg',
  'KIMANDY-545.jpg',
  'KIMANDY-546.jpg',
  'KIMANDY-547.jpg',
  'KIMANDY-548.jpg',
  'KIMANDY-549.jpg',
  'KIMANDY-550.jpg',
  'KIMANDY-552.jpg',
  'KIMANDY-554.jpg',
  'KIMANDY-566.jpg',
  'KIMANDY-582.jpg',
  'KIMANDY-584.jpg',
  'KIMANDY-643.jpg',
  'KIMANDY-644.jpg',
  'KIMANDY-655.jpg',
  'KIMANDY-658.jpg',
  'KIMANDY-662.jpg',
  'KIMANDY-665.jpg',
  'KIMANDY-669.jpg',
  'KIMANDY-670.jpg',
  'KIMANDY-673.jpg',
  'KIMANDY-682.jpg'
]

const albumImages = albumImageFiles.map((fileName, index) => ({
  src: `/wedding/album/${encodeURIComponent(fileName)}`,
  index
}))

const albumAutoplayDelayMs = 5000
const invitationCanvasWidth = 402
const activeAlbumIndex = ref(0)
const [albumEmblaRef, albumEmblaApi] = useEmblaCarousel({
  align: 'center',
  containScroll: false,
  duration: 28,
  loop: true,
  skipSnaps: false
})
const invitationScale = ref(1)
const invitationFrame = ref<HTMLElement | null>(null)
const invitationPage = ref<HTMLElement | null>(null)
const invitationFrameHeight = ref<number | null>(null)
let albumAutoplayTimer: ReturnType<typeof setInterval> | undefined
let invitationResizeObserver: ResizeObserver | undefined
let invitationResizeFrame: number | undefined
const preloadedAlbumImages = new Set<number>()

const wrapAlbumIndex = (index: number) => ((index % albumImages.length) + albumImages.length) % albumImages.length

const shouldReduceAlbumMotion = () => {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const preloadAlbumImage = (index: number) => {
  if (!import.meta.client) {
    return
  }

  const wrappedIndex = wrapAlbumIndex(index)
  const image = albumImages[wrappedIndex]

  if (!image || preloadedAlbumImages.has(wrappedIndex)) {
    return
  }

  preloadedAlbumImages.add(wrappedIndex)
  const preloadImage = new Image()
  preloadImage.decoding = 'async'
  preloadImage.src = image.src
}

const preloadNearbyAlbumImages = (index = activeAlbumIndex.value) => {
  for (let offset = -3; offset <= 3; offset += 1) {
    preloadAlbumImage(index + offset)
  }
}

const syncAlbumIndex = () => {
  const api = albumEmblaApi.value

  if (!api) {
    return
  }

  const index = api.selectedScrollSnap()
  activeAlbumIndex.value = index
  preloadNearbyAlbumImages(index)
}

const startAlbumAutoplay = () => {
  if (shouldReduceAlbumMotion()) {
    return
  }

  stopAlbumAutoplay()
  albumAutoplayTimer = setInterval(() => {
    showNextAlbumSlide()
  }, albumAutoplayDelayMs)
}

const stopAlbumAutoplay = () => {
  if (albumAutoplayTimer) {
    clearInterval(albumAutoplayTimer)
    albumAutoplayTimer = undefined
  }
}

const showPreviousAlbumSlide = () => {
  const api = albumEmblaApi.value

  if (!api) {
    return
  }

  api.scrollPrev()
}

const showNextAlbumSlide = () => {
  const api = albumEmblaApi.value

  if (!api) {
    return
  }

  api.scrollNext()
}

const onAlbumSlideClick = (index: number) => {
  albumEmblaApi.value?.scrollTo(index)
}

watch(
  albumEmblaApi,
  (api) => {
    if (!api) {
      return
    }

    syncAlbumIndex()
    api.on('select', syncAlbumIndex)
    api.on('reInit', syncAlbumIndex)
  },
  { immediate: true }
)

const onAlbumKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    showPreviousAlbumSlide()
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    showNextAlbumSlide()
  }
}

const updateInvitationScale = () => {
  if (invitationResizeFrame) {
    window.cancelAnimationFrame(invitationResizeFrame)
  }

  invitationResizeFrame = window.requestAnimationFrame(() => {
    invitationResizeFrame = undefined

    if (!invitationFrame.value) {
      return
    }

    if (!invitationPage.value) {
      return
    }

    const frameWidth = invitationFrame.value.getBoundingClientRect().width
    const nextScale = Number((frameWidth / invitationCanvasWidth).toFixed(5))
    const nextFrameHeight = Math.ceil(invitationPage.value.scrollHeight * nextScale)

    if (invitationScale.value !== nextScale) {
      invitationScale.value = nextScale
    }

    if (invitationFrameHeight.value !== nextFrameHeight) {
      invitationFrameHeight.value = nextFrameHeight
    }
  })
}

const flushInvitationScale = () => {
  if (!invitationFrame.value) {
    return
  }

  if (!invitationPage.value) {
    return
  }

  const frameWidth = invitationFrame.value.getBoundingClientRect().width
  const nextScale = Number((frameWidth / invitationCanvasWidth).toFixed(5))
  invitationScale.value = nextScale
  invitationFrameHeight.value = Math.ceil(invitationPage.value.scrollHeight * nextScale)
}

onMounted(() => {
  void nextTick(flushInvitationScale)
  void nextTick(() => albumEmblaApi.value?.reInit())
  preloadNearbyAlbumImages()

  if (typeof ResizeObserver !== 'undefined' && invitationFrame.value) {
    invitationResizeObserver = new ResizeObserver(updateInvitationScale)
    invitationResizeObserver.observe(invitationFrame.value)
  }

  if (invitationResizeObserver && invitationPage.value) {
    invitationResizeObserver.observe(invitationPage.value)
  }

  window.addEventListener('resize', updateInvitationScale)
  startAlbumAutoplay()
})

onUnmounted(() => {
  if (invitationResizeFrame) {
    window.cancelAnimationFrame(invitationResizeFrame)
  }

  invitationResizeObserver?.disconnect()
  window.removeEventListener('resize', updateInvitationScale)
  stopAlbumAutoplay()
})

const form = reactive({
  fullName: '',
  preferredName: '',
  guestOf: defaultGuestOf as GuestOfValue,
  email: '',
  phone: '',
  plusOne: '',
  plusOneAttendance: defaultPlusOneAttendance as PlusOneValue,
  dietary: '',
  attendance: defaultAttendance as AttendanceValue
})

const touched = reactive({
  fullName: false,
  preferredName: false,
  guestOf: false,
  email: false,
  phone: false,
  attendance: false
})

const errors = reactive({
  fullName: '',
  preferredName: '',
  guestOf: '',
  email: '',
  phone: '',
  attendance: ''
})

const hasValidationErrors = computed(() => Object.values(errors).some(Boolean))

const formatUnit = (value: number) => String(value).padStart(2, '0')

const validateField = (field: keyof typeof errors) => {
  if (field === 'fullName') {
    errors.fullName = form.fullName.trim() ? '' : 'invite.rsvp.validation.fullNameRequired'
  }

  if (field === 'preferredName') {
    errors.preferredName = form.preferredName.trim() ? '' : 'invite.rsvp.validation.preferredNameRequired'
  }

  if (field === 'email') {
    errors.email = form.email.trim()
      ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? '' : 'invite.rsvp.validation.emailInvalid')
      : 'invite.rsvp.validation.emailRequired'
  }

  if (field === 'guestOf') {
    errors.guestOf = form.guestOf ? '' : 'invite.rsvp.validation.guestOfRequired'
  }

  if (field === 'phone') {
    errors.phone = form.phone.trim() ? '' : 'invite.rsvp.validation.phoneRequired'
  }

  if (field === 'attendance') {
    errors.attendance = form.attendance ? '' : 'invite.rsvp.validation.attendanceRequired'
  }
}

const validate = () => {
  validateField('fullName')
  validateField('preferredName')
  validateField('guestOf')
  validateField('email')
  validateField('phone')
  validateField('attendance')
  return !hasValidationErrors.value
}

const focusFirstInvalidField = async () => {
  await nextTick()
  document.querySelector<HTMLInputElement>('.invite-form input[aria-invalid="true"]')?.focus()
}

const formatSheetDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0')

  return [
    `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`,
    `${pad(date.getHours())}:${pad(date.getMinutes())}`
  ].join(' ')
}

const resetForm = () => {
  form.fullName = ''
  form.preferredName = ''
  form.guestOf = defaultGuestOf
  form.email = ''
  form.phone = ''
  form.plusOne = ''
  form.plusOneAttendance = defaultPlusOneAttendance
  form.dietary = ''
  form.attendance = defaultAttendance
  touched.fullName = false
  touched.preferredName = false
  touched.guestOf = false
  touched.email = false
  touched.phone = false
  touched.attendance = false
  errors.fullName = ''
  errors.preferredName = ''
  errors.guestOf = ''
  errors.email = ''
  errors.phone = ''
  errors.attendance = ''
}

const onSubmit = async () => {
  reset()
  touched.fullName = true
  touched.preferredName = true
  touched.guestOf = true
  touched.email = true
  touched.phone = true
  touched.attendance = true

  if (!validate()) {
    await focusFirstInvalidField()
    return
  }

  const attendance = form.attendance as Exclude<AttendanceValue, ''>

  const result = await submit({
    submissionType: 'rsvp',
    createdAt: formatSheetDateTime(new Date()),
    name: form.fullName.trim(),
    preferredName: form.preferredName.trim(),
    guestOf: form.guestOf ? guestOfEnglishLabels[form.guestOf] : '',
    attending: attendance,
    email: form.email.trim(),
    phone: form.phone.trim(),
    plusOneAttendance: form.plusOneAttendance,
    plusOne: form.plusOne.trim(),
    dietary: form.dietary.trim()
  })

  if (result.ok) {
    resetForm()
  }
}
</script>

<template>
  <div ref="invitationFrame" class="invitation-frame" :style="invitationFrameHeight ? { height: `${invitationFrameHeight}px` } : undefined">
    <div ref="invitationPage" class="invitation-page" :style="{ '--invite-scale': invitationScale }">
    <section class="invite-section invite-hero" aria-labelledby="invite-title">
      <p class="invite-kicker" data-reveal="center">{{ t('invite.hero.kicker') }}</p>
      <img class="invite-names" src="/wedding/assets/names.png" :alt="t('invite.hero.namesAlt')" decoding="async" data-reveal="image-center" style="--reveal-delay: 90ms">
      <img
        class="invite-couple"
        src="/wedding/assets/couple-illustration.png"
        :alt="t('invite.hero.coupleAlt')"
        width="1328"
        height="1760"
        fetchpriority="high"
        decoding="async"
        data-reveal="image-center"
        style="--reveal-delay: 170ms"
      >
      <h1 v-if="locale === 'en'" id="invite-title" data-reveal="center" style="--reveal-delay: 260ms">DECEMBER 19<sup>TH</sup> 2026</h1>
      <h1 v-else id="invite-title" data-reveal="center" style="--reveal-delay: 260ms">{{ t('invite.hero.date') }}</h1>
      <p class="invite-location" data-reveal="center" style="--reveal-delay: 330ms">{{ t('invite.hero.location') }}</p>
    </section>

    <section class="invite-section invite-countdown" aria-labelledby="countdown-title">
      <img class="invite-monogram" src="/wedding/assets/monogram.png" :alt="t('invite.countdown.monogramAlt')" loading="lazy" decoding="async" data-reveal="image-center">
      <h2 id="countdown-title" data-reveal="center" style="--reveal-delay: 80ms">{{ t('invite.countdown.title') }}</h2>
      <p data-reveal="center" style="--reveal-delay: 150ms">
        {{ t('invite.countdown.copyLine1') }}
        {{ t('invite.countdown.copyLine2') }}
      </p>
      <div class="countdown-shell" aria-live="polite" data-reveal="image-center" style="--reveal-delay: 230ms">
        <img src="/wedding/assets/ornate-card.png" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <div class="countdown-values" data-stagger data-stagger-base="300" data-stagger-step="44">
          <div v-for="unit in countdownUnits" :key="unit.key">
            <strong>{{ hasStarted && !isComplete ? formatUnit(unit.value) : '00' }}</strong>
            <span>{{ unit.label }}</span>
          </div>
        </div>
        <p>{{ t('invite.countdown.cardLine1') }}<br>{{ t('invite.countdown.cardLine2') }}</p>
      </div>
    </section>

    <section class="invite-section invite-calendar" aria-labelledby="calendar-title">
      <p data-reveal="text">
        {{ t('invite.calendar.copyLine1') }}
        {{ t('invite.calendar.copyLine2') }}
      </p>
      <h2 id="calendar-title" class="sr-only">{{ t('invite.calendar.title') }}</h2>
      <img :src="calendarImageSrc" :alt="t('invite.calendar.alt')" loading="lazy" decoding="async" data-reveal="image" style="--reveal-delay: 120ms">
    </section>

    <section class="invite-section invite-people" :aria-label="t('invite.people.ariaLabel')">
      <div class="people-grid" data-stagger="image" data-stagger-step="120">
        <figure>
          <img src="/wedding/assets/bride-frame.png" :alt="t('invite.people.brideAlt')" loading="lazy" decoding="async">
          <figcaption>
            <span>{{ t('invite.people.brideRole') }}</span>
            <strong>{{ t('invite.people.brideName') }}</strong>
          </figcaption>
        </figure>
        <figure>
          <img src="/wedding/assets/groom-frame.png" :alt="t('invite.people.groomAlt')" loading="lazy" decoding="async">
          <figcaption>
            <span>{{ t('invite.people.groomRole') }}</span>
            <strong>{{ t('invite.people.groomName') }}</strong>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="invite-section invite-card invite-invitation" aria-labelledby="invitation-title">
      <h2 id="invitation-title" data-reveal="center">{{ t('invite.invitation.title') }}</h2>
      <div class="parents-grid" data-stagger data-stagger-base="80" data-stagger-step="80">
        <div>
          <span>{{ locale === 'vi' ? t('invite.invitation.groomFamilyTitle') : t('invite.invitation.parentsTitle') }}</span>
          <p>{{ t('invite.invitation.groomParentsLine1') }}<br>{{ t('invite.invitation.groomParentsLine2') }}</p>
        </div>
        <div>
          <span>{{ locale === 'vi' ? t('invite.invitation.brideFamilyTitle') : t('invite.invitation.parentsTitle') }}</span>
          <p>{{ t('invite.invitation.brideParentsLine1') }}<br>{{ t('invite.invitation.brideParentsLine2') }}</p>
        </div>
      </div>
      <p class="invitation-intro" data-reveal="center" style="--reveal-delay: 170ms">{{ t('invite.invitation.intro') }}</p>
      <h3 data-reveal="center" style="--reveal-delay: 230ms">{{ t('invite.people.groomName') }}</h3>
      <span data-reveal="center" style="--reveal-delay: 290ms">{{ t('invite.invitation.and') }}</span>
      <h3 data-reveal="center" style="--reveal-delay: 350ms">{{ t('invite.people.brideName') }}</h3>
      <strong class="invitation-held" data-reveal="center" style="--reveal-delay: 410ms">{{ t('invite.invitation.heldAt') }}</strong>
      <p class="invitation-date" data-reveal="center" style="--reveal-delay: 470ms">{{ t('invite.invitation.dateLeft') }} <span class="invitation-date-separator">|</span> 19.12 <span class="invitation-date-separator">|</span> 2026</p>
      <p class="invitation-location" data-reveal="center" style="--reveal-delay: 520ms">{{ t('invite.hero.location') }}</p>
      <a
        class="invitation-map-link"
        href="https://maps.app.goo.gl/qNXnAsNbC3qgGt1FA"
        target="_blank"
        rel="noopener noreferrer"
        data-reveal="image-center"
        style="--reveal-delay: 570ms"
      >
        <img class="invitation-pin" src="/wedding/assets/pin.png" alt="" loading="lazy" decoding="async">
        <span class="sr-only">{{ t('invite.hero.location') }}</span>
      </a>
      <span class="invitation-direction" data-reveal="center" style="--reveal-delay: 610ms">{{ t('invite.invitation.direction') }}</span>
      <p class="invitation-note" data-reveal="center" style="--reveal-delay: 650ms">
        {{ t('invite.invitation.note') }}
      </p>
      <p class="invitation-rsvp-note" data-reveal="center" style="--reveal-delay: 690ms">
        {{ t('invite.invitation.rsvpLine1') }} <strong>{{ t('invite.invitation.rsvpDate') }}</strong><br>{{ t('invite.invitation.rsvpLine2') }}
      </p>
    </section>

    <section class="invite-section invite-timeline" aria-labelledby="timeline-title">
      <h2 id="timeline-title" data-reveal="center">{{ t('invite.timeline.title') }}</h2>
      <p data-reveal="center" style="--reveal-delay: 90ms">{{ t('invite.timeline.copy') }}</p>
      <div class="timeline-frame" data-reveal="image-center" style="--reveal-delay: 170ms">
        <img src="/wedding/assets/timeline-frame.png" alt="" aria-hidden="true" loading="lazy" decoding="async">
        <div class="timeline-milestone timeline-milestone--tea" data-reveal="center" style="--reveal-delay: 250ms">
          <h3>{{ t('invite.timeline.teaTitle') }}</h3>
          <p v-if="locale === 'en'">DECEMBER 17<sup>TH</sup> 2026</p>
          <p v-else>{{ t('invite.timeline.teaDate') }}</p>
        </div>
        <div class="timeline-milestone timeline-milestone--wedding" data-reveal="center" style="--reveal-delay: 310ms">
          <h3>{{ t('invite.timeline.weddingTitle') }}</h3>
          <p v-if="locale === 'en'">DECEMBER 19<sup>TH</sup> 2026</p>
          <p v-else>{{ t('invite.timeline.weddingDate') }}</p>
        </div>
        <div class="timeline-events" data-stagger data-stagger-base="360" data-stagger-step="45" data-stagger-max="270">
          <article v-for="item in timelineItems" :key="`${item.time}-${item.title}`">
            <time>{{ item.time }}</time>
            <strong>{{ item.title }}</strong>
          </article>
        </div>
      </div>
    </section>

    <section class="invite-section invite-dresscode" aria-labelledby="dresscode-title">
      <h2 id="dresscode-title" data-reveal="center">{{ t('invite.dresscode.title') }}</h2>
      <h3 data-reveal="center" style="--reveal-delay: 80ms">{{ t('invite.dresscode.attire') }}</h3>
      <p class="dresscode-intro" data-reveal="center" style="--reveal-delay: 150ms">{{ t('invite.dresscode.intro') }}</p>
      <div class="dress-swatches" :aria-label="t('invite.dresscode.colorsAria')" data-stagger data-stagger-base="210" data-stagger-step="42" data-stagger-max="252">
        <span v-for="item in dressColors" :key="item.key" class="dress-swatch">
          <span class="dress-swatch__dot" :style="{ backgroundColor: item.color }" aria-hidden="true"></span>
          <span class="dress-swatch__label">{{ t(`invite.dresscode.colors.${item.key}`) }}</span>
        </span>
      </div>
      <img
        src="/wedding/assets/dress-figures.png"
        :alt="t('invite.dresscode.imageAlt')"
        width="250"
        height="206"
        loading="lazy"
        decoding="async"
        data-reveal="image-center"
        style="--reveal-delay: 260ms"
      >
      <p class="dresscode-note" data-reveal="center" style="--reveal-delay: 340ms">{{ t('invite.dresscode.noteLine1') }} <strong>{{ t('invite.dresscode.noteStrong') }}</strong> {{ t('invite.dresscode.noteLine2') }}</p>
    </section>

    <section class="invite-section invite-love" aria-labelledby="love-title">
      <h2 id="love-title" data-reveal="center">{{ t('invite.love.title') }}</h2>
      <img
        class="love-story-city"
        src="/wedding/assets/love-story-city.png"
        :alt="t('invite.love.imageAlt')"
        width="344"
        height="198"
        loading="lazy"
        decoding="async"
        data-reveal="image-center"
        style="--reveal-delay: 90ms"
      >
      <p class="love-story-copy" data-reveal="center" style="--reveal-delay: 180ms">
        {{ t('invite.love.paragraph1') }}<br><br>
        {{ t('invite.love.paragraph2') }}<br><br>
        {{ t('invite.love.paragraph3') }}<br><br>
        {{ t('invite.love.paragraph4') }}<br><br>
        {{ t('invite.love.paragraph5') }}
      </p>
    </section>

    <section id="rsvp" class="invite-section invite-rsvp" aria-labelledby="rsvp-title">
      <h2 id="rsvp-title" data-reveal="center">{{ t('invite.rsvp.title') }}</h2>
      <img class="rsvp-flower" src="/wedding/assets/rsvp-flower.png" alt="" aria-hidden="true" width="150" height="157" loading="lazy" decoding="async" data-reveal="flower">
      <form class="invite-form" novalidate data-stagger data-stagger-base="70" data-stagger-step="34" data-stagger-max="272" @submit.prevent="onSubmit">
        <div v-if="state === 'success'" class="invite-alert invite-alert--success" role="status">
          {{ t('invite.rsvp.status.success') }}
        </div>

        <div v-if="state === 'error' && !hasValidationErrors" class="invite-alert invite-alert--error" role="alert">
          {{ errorKey === 'forms.status.missingEndpoint' ? t('invite.rsvp.status.missingEndpoint') : t('invite.rsvp.status.submitError') }}
        </div>

        <label for="invite-fullName">
          <span>{{ t('invite.rsvp.fields.fullName') }}</span>
          <input
            id="invite-fullName"
            v-model="form.fullName"
            type="text"
            autocomplete="name"
            :placeholder="t('invite.rsvp.placeholders.fullName')"
            :aria-invalid="Boolean(errors.fullName)"
            :aria-describedby="errors.fullName ? 'invite-fullName-error' : undefined"
            @blur="touched.fullName = true; validateField('fullName')"
            @input="touched.fullName && validateField('fullName')"
          >
          <small v-if="errors.fullName" id="invite-fullName-error" class="invite-field-error">{{ t(errors.fullName) }}</small>
        </label>

        <label for="invite-preferredName">
          <span>{{ t('invite.rsvp.fields.preferredName') }}</span>
          <input
            id="invite-preferredName"
            v-model="form.preferredName"
            type="text"
            :placeholder="t('invite.rsvp.placeholders.preferredName')"
            :aria-invalid="Boolean(errors.preferredName)"
            :aria-describedby="errors.preferredName ? 'invite-preferredName-error' : undefined"
            @blur="touched.preferredName = true; validateField('preferredName')"
            @input="touched.preferredName && validateField('preferredName')"
          >
          <small v-if="errors.preferredName" id="invite-preferredName-error" class="invite-field-error">{{ t(errors.preferredName) }}</small>
        </label>

        <fieldset id="invite-guestOf" class="invite-choice-group invite-choice-group--guest" :aria-invalid="Boolean(errors.guestOf)" :aria-describedby="errors.guestOf ? 'invite-guestOf-error' : undefined">
          <legend>{{ t('invite.rsvp.fields.guestOf') }}</legend>
          <label>
            <input v-model="form.guestOf" type="radio" name="guestOf" value="brideGroom" @change="touched.guestOf = true; validateField('guestOf')">
            <span>{{ t('invite.rsvp.guestOf.brideGroom') }}</span>
          </label>
          <label>
            <input v-model="form.guestOf" type="radio" name="guestOf" value="brideParents" @change="touched.guestOf = true; validateField('guestOf')">
            <span>{{ t('invite.rsvp.guestOf.brideParents') }}</span>
          </label>
          <label>
            <input v-model="form.guestOf" type="radio" name="guestOf" value="groomParents" @change="touched.guestOf = true; validateField('guestOf')">
            <span>{{ t('invite.rsvp.guestOf.groomParents') }}</span>
          </label>
          <small v-if="errors.guestOf" id="invite-guestOf-error" class="invite-field-error">{{ t(errors.guestOf) }}</small>
        </fieldset>

        <label for="invite-email">
          <span>{{ t('invite.rsvp.fields.email') }}</span>
          <input
            id="invite-email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            :placeholder="t('invite.rsvp.placeholders.email')"
            :aria-invalid="Boolean(errors.email)"
            :aria-describedby="errors.email ? 'invite-email-error' : undefined"
            @blur="touched.email = true; validateField('email')"
            @input="touched.email && validateField('email')"
          >
          <small v-if="errors.email" id="invite-email-error" class="invite-field-error">{{ t(errors.email) }}</small>
        </label>

        <label for="invite-phone">
          <span>{{ t('invite.rsvp.fields.phone') }}</span>
          <input
            id="invite-phone"
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            :placeholder="t('invite.rsvp.placeholders.phone')"
            :aria-invalid="Boolean(errors.phone)"
            :aria-describedby="errors.phone ? 'invite-phone-error' : undefined"
            @blur="touched.phone = true; validateField('phone')"
            @input="touched.phone && validateField('phone')"
          >
          <small v-if="errors.phone" id="invite-phone-error" class="invite-field-error">{{ t(errors.phone) }}</small>
        </label>

        <fieldset id="invite-attendance" class="invite-choice-group invite-choice-group--attendance" :aria-invalid="Boolean(errors.attendance)" :aria-describedby="errors.attendance ? 'invite-attendance-error' : undefined">
          <legend>{{ t('invite.rsvp.fields.attendance') }}</legend>
          <label>
            <input
              v-model="form.attendance"
              type="radio"
              name="attendance"
              value="yes"
              @change="touched.attendance = true; validateField('attendance')"
            >
            <span>{{ t('invite.rsvp.attendance.yes') }}</span>
          </label>
          <label>
            <input
              v-model="form.attendance"
              type="radio"
              name="attendance"
              value="no"
              @change="touched.attendance = true; validateField('attendance')"
            >
            <span>{{ t('invite.rsvp.attendance.no') }}</span>
          </label>
          <small v-if="errors.attendance" id="invite-attendance-error" class="invite-field-error">{{ t(errors.attendance) }}</small>
        </fieldset>

        <fieldset class="invite-choice-group invite-choice-group--plus-one">
          <legend>{{ t('invite.rsvp.fields.plusOneAttendance') }}</legend>
          <label>
            <input v-model="form.plusOneAttendance" type="radio" name="plusOneAttendance" value="yes">
            <span>{{ t('invite.common.yes') }}</span>
          </label>
          <label>
            <input v-model="form.plusOneAttendance" type="radio" name="plusOneAttendance" value="no">
            <span>{{ t('invite.common.no') }}</span>
          </label>
        </fieldset>

        <label v-if="form.plusOneAttendance !== 'no'" for="invite-plusOne">
          <input id="invite-plusOne" v-model="form.plusOne" type="text" :placeholder="t('invite.rsvp.placeholders.plusOne')">
        </label>

        <label for="invite-dietary">
          <span>{{ t('invite.rsvp.fields.dietary') }}</span>
            <input id="invite-dietary" v-model="form.dietary" type="text" :placeholder="t('invite.rsvp.placeholders.dietary')">
        </label>

        <button class="invite-submit" type="submit" :disabled="isLoading" :aria-busy="isLoading">
          <span class="invite-submit__label">{{ isLoading ? t('invite.rsvp.submitSending') : t('invite.rsvp.submit') }}</span>
        </button>
      </form>
      <img class="rsvp-swans" src="/wedding/Links/17.1.png" alt="" aria-hidden="true" width="150" height="111" loading="lazy" decoding="async" data-reveal="image-center" style="--reveal-delay: 320ms">
    </section>

    <section class="invite-section invite-album" aria-labelledby="album-title">
      <h2 id="album-title">{{ t('invite.album.title') }}</h2>
      <div
        class="album-carousel"
        role="region"
        aria-roledescription="carousel"
        :aria-label="t('invite.album.ariaLabel')"
        tabindex="0"
        @focusin="stopAlbumAutoplay"
        @focusout="startAlbumAutoplay"
        @mouseenter="stopAlbumAutoplay"
        @mouseleave="startAlbumAutoplay"
        @keydown="onAlbumKeydown"
      >
        <div ref="albumEmblaRef" class="album-carousel__viewport">
          <div class="album-carousel__track">
            <div
              v-for="image in albumImages"
              :key="image.index"
              class="album-carousel__slide"
            >
              <div
                class="album-carousel__photo"
                role="button"
                :tabindex="image.index === activeAlbumIndex ? 0 : -1"
                :aria-label="t('invite.album.showPhoto', { current: image.index + 1, total: albumImages.length, alt: t('invite.album.imageAlt', { index: image.index + 1 }) })"
                :aria-current="image.index === activeAlbumIndex ? 'true' : undefined"
                @click="onAlbumSlideClick(image.index)"
                @keydown.enter.prevent="onAlbumSlideClick(image.index)"
                @keydown.space.prevent="onAlbumSlideClick(image.index)"
              >
                <img
                  :src="image.src"
                  :alt="image.index === activeAlbumIndex ? t('invite.album.imageAlt', { index: image.index + 1 }) : ''"
                  :loading="image.index === 0 ? 'eager' : 'lazy'"
                  :fetchpriority="image.index === 0 ? 'high' : undefined"
                  decoding="async"
                >
              </div>
            </div>
          </div>
        </div>

        <button class="album-carousel__control album-carousel__control--previous" type="button" :aria-label="t('invite.album.previous')" @click="showPreviousAlbumSlide">
          <ChevronLeft aria-hidden="true" />
        </button>
        <button class="album-carousel__control album-carousel__control--next" type="button" :aria-label="t('invite.album.next')" @click="showNextAlbumSlide">
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <p class="invite-album__caption">{{ t('invite.album.caption') }}</p>
    </section>

    <footer class="invite-section invite-footer">
      <h2 data-reveal="text">{{ t('invite.footer.contactTitle') }}</h2>
      <p class="invite-footer__contact-copy" data-reveal="text" style="--reveal-delay: 80ms"><em>{{ t('invite.footer.contactKicker') }}</em><br>{{ t('invite.footer.contactLine1') }}<br>{{ t('invite.footer.contactLine2') }}</p>
      <address class="invite-footer__contacts" data-stagger data-stagger-base="140" data-stagger-step="48">
        <span>{{ t('invite.footer.brideContactName') }} - <em>{{ t('invite.people.brideRoleLower') }}</em></span>
        <a href="tel:0909385561">0909 385 561</a>
        <span>{{ t('invite.footer.groomContactName') }} - <em>{{ t('invite.people.groomRoleLower') }}</em></span>
        <a href="tel:0942024002">0942 024 002</a>
      </address>
      <section class="invite-footer__thanks" aria-labelledby="thanks-title" data-reveal="image" style="--reveal-delay: 180ms">
        <h2 id="thanks-title">{{ t('invite.footer.thanksTitle') }}</h2>
        <p>{{ t('invite.footer.thanksLine1') }}<br>{{ t('invite.footer.thanksLine2') }}</p>
        <p class="invite-footer__signoff">{{ t('invite.footer.signoffLine1') }}<br>{{ t('invite.footer.signoffLine2') }}</p>
        <img src="/wedding/assets/thank-you-florals.png" alt="" aria-hidden="true" width="278" height="155" loading="lazy" decoding="async">
      </section>
    </footer>
    </div>
  </div>
</template>
