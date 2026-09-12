<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'

type AttendanceValue = '' | 'yes' | 'no'
type GuestOfValue = '' | 'brideGroom' | 'brideParents' | 'groomParents'
type PlusOneValue = '' | 'yes' | 'no'

const defaultGuestOf: GuestOfValue = 'brideGroom'
const defaultAttendance: AttendanceValue = 'yes'
const defaultPlusOneAttendance: PlusOneValue = 'yes'

const targetIso = '2026-12-19T17:30:00+07:00'
const { parts, hasStarted, isComplete } = useCountdown(targetIso)
const { locale } = useI18n()
const { state, errorKey, isLoading, reset, submit } = useSheetSubmit()

const countdownUnits = computed(() => [
  { key: 'days', value: parts.value.days, label: 'DAYS' },
  { key: 'hours', value: parts.value.hours, label: 'HOURS' },
  { key: 'minutes', value: parts.value.minutes, label: 'MINUTES' },
  { key: 'seconds', value: parts.value.seconds, label: 'SECONDS' }
])

const timelineItems = [
  { time: '17:30', title: 'WELCOME GUEST' },
  { time: '18:30', title: 'CEREMONY' },
  { time: '19:00', title: 'RECEPTION DINNER' },
  { time: '20:00', title: 'ENTERTAINMENT' },
  { time: '21:00', title: 'AFTER PARTY' },
  { time: '21:00', title: 'GOODBYE' }
]

const dressColors = [
  { label: 'Royal Blue', color: '#265391' },
  { label: 'Sage Green', color: '#bed5ab' },
  { label: 'Dusty Mauve', color: '#cca7bc' },
  { label: 'Butter Yellow', color: '#f3dfa9' },
  { label: 'Light Blue', color: '#b7e2f8' },
  { label: 'Light Pink', color: '#ffd4df' },
  { label: 'Warm Beige', color: '#ded5c8' }
]

const albumImages = [
  {
    src: '/wedding/assets/album-beach-walk.jpg',
    alt: 'Nguyen and Kim walking together on the beach'
  },
  {
    src: '/wedding/assets/album-vows.jpg',
    alt: 'Nguyen and Kim during their beach vows'
  },
  {
    src: '/wedding/assets/album-garden.jpg',
    alt: 'Nguyen and Kim in a garden portrait'
  }
]

const activeAlbumIndex = ref(0)
const albumPointerStartX = ref<number | null>(null)
const albumDidSwipe = ref(false)
let albumAutoplayTimer: ReturnType<typeof setInterval> | undefined

const previousAlbumIndex = computed(() => (activeAlbumIndex.value - 1 + albumImages.length) % albumImages.length)
const nextAlbumIndex = computed(() => (activeAlbumIndex.value + 1) % albumImages.length)

const stopAlbumAutoplay = () => {
  if (albumAutoplayTimer) {
    clearInterval(albumAutoplayTimer)
    albumAutoplayTimer = undefined
  }
}

const startAlbumAutoplay = () => {
  if (!import.meta.client || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  stopAlbumAutoplay()
  albumAutoplayTimer = setInterval(() => {
    activeAlbumIndex.value = (activeAlbumIndex.value + 1) % albumImages.length
  }, 5000)
}

const selectAlbumSlide = (index: number) => {
  activeAlbumIndex.value = (index + albumImages.length) % albumImages.length
  startAlbumAutoplay()
}

const showPreviousAlbumSlide = () => {
  selectAlbumSlide(activeAlbumIndex.value - 1)
}

const showNextAlbumSlide = () => {
  selectAlbumSlide(activeAlbumIndex.value + 1)
}

const onAlbumSlideClick = (index: number, event: MouseEvent) => {
  if (albumDidSwipe.value) {
    event.preventDefault()
    albumDidSwipe.value = false
    return
  }

  selectAlbumSlide(index)
}

const onAlbumPointerDown = (event: PointerEvent) => {
  if (event.pointerType === 'mouse') {
    return
  }

  albumPointerStartX.value = event.clientX
  albumDidSwipe.value = false
  stopAlbumAutoplay()
}

const onAlbumPointerUp = (event: PointerEvent) => {
  if (albumPointerStartX.value === null) {
    return
  }

  const delta = event.clientX - albumPointerStartX.value
  albumPointerStartX.value = null

  if (Math.abs(delta) < 32) {
    startAlbumAutoplay()
    return
  }

  albumDidSwipe.value = true

  if (delta > 0) {
    showPreviousAlbumSlide()
    return
  }

  showNextAlbumSlide()
}

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

onMounted(startAlbumAutoplay)
onUnmounted(stopAlbumAutoplay)

const formStartedAt = ref(Date.now())
const form = reactive({
  fullName: '',
  preferredName: '',
  guestOf: defaultGuestOf as GuestOfValue,
  email: '',
  phone: '',
  plusOne: '',
  plusOneAttendance: defaultPlusOneAttendance as PlusOneValue,
  dietary: '',
  attendance: defaultAttendance as AttendanceValue,
  website: ''
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
    errors.fullName = form.fullName.trim() ? '' : 'Please enter your full name.'
  }

  if (field === 'preferredName') {
    errors.preferredName = form.preferredName.trim() ? '' : 'Please enter your preferred name.'
  }

  if (field === 'email') {
    errors.email = form.email.trim()
      ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? '' : 'Please enter a valid email address.')
      : 'Please enter your email.'
  }

  if (field === 'guestOf') {
    errors.guestOf = form.guestOf ? '' : 'Please choose whose guest you are.'
  }

  if (field === 'phone') {
    errors.phone = form.phone.trim() ? '' : 'Please enter your contact number.'
  }

  if (field === 'attendance') {
    errors.attendance = form.attendance ? '' : 'Please choose your attendance.'
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
  form.website = ''
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
  formStartedAt.value = Date.now()
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
    submissionId: createSubmissionId(),
    locale: locale.value,
    createdAt: new Date().toISOString(),
    pageUrl: import.meta.client ? window.location.href : '',
    honeypot: form.website,
    elapsedMs: Date.now() - formStartedAt.value,
    name: form.fullName.trim(),
    attending: attendance,
    contact: `${form.email.trim()} | ${form.phone.trim()}`,
    note: [
      `Preferred name: ${form.preferredName.trim() || '-'}`,
      `Guest of: ${form.guestOf || '-'}`,
      `Bringing a plus one: ${form.plusOneAttendance || '-'}`,
      `Plus one: ${form.plusOne.trim() || '-'}`,
      `Dietary: ${form.dietary.trim() || '-'}`
    ].join('\n')
  })

  if (result.ok) {
    resetForm()
  }
}
</script>

<template>
  <div class="invitation-page">
    <section class="invite-section invite-hero" aria-labelledby="invite-title">
      <p class="invite-kicker">SAVE THE DATE</p>
      <img class="invite-names" src="/wedding/assets/names.png" alt="Nguyen and Kim">
      <img
        class="invite-couple"
        src="/wedding/assets/couple-illustration.png"
        alt="Illustration of Nguyen and Kim"
        width="1328"
        height="1760"
        fetchpriority="high"
      >
      <h1 id="invite-title">DECEMBER 19<sup>TH</sup> 2026</h1>
      <p class="invite-location">JW MARRIOTT HOTEL &amp; SUITES SAIGON</p>
    </section>

    <section class="invite-section invite-countdown" aria-labelledby="countdown-title">
      <img class="invite-monogram" src="/wedding/assets/monogram.png" alt="K N monogram">
      <h2 id="countdown-title">COUNTDOWN</h2>
      <p>
        In the heart of Saigon, a day of love and celebration awaits.
        A moment to slow down, to be present, and to share in the beginning of our forever.
      </p>
      <div class="countdown-shell" aria-live="polite">
        <img src="/wedding/assets/ornate-card.png" alt="" aria-hidden="true">
        <div class="countdown-values">
          <div v-for="unit in countdownUnits" :key="unit.key">
            <strong>{{ hasStarted && !isComplete ? formatUnit(unit.value) : '00' }}</strong>
            <span>{{ unit.label }}</span>
          </div>
        </div>
        <p>The day is getting closer<br>until we say "I do"</p>
      </div>
    </section>

    <section class="invite-section invite-calendar" aria-labelledby="calendar-title">
      <p>
        With every passing day, we're one step closer to the moment we've been waiting for.
        Save the date, and come share in a day filled with love and memories to keep.
      </p>
      <h2 id="calendar-title" class="sr-only">Wedding calendar</h2>
      <img src="/wedding/assets/calendar.png" alt="December 2026 calendar with the nineteenth marked as best day">
    </section>

    <section class="invite-section invite-people" aria-label="Bride and groom">
      <div class="people-grid">
        <figure>
          <img src="/wedding/assets/bride-frame.png" alt="Portrait of the bride Nguyen Le Thien Kim">
          <figcaption>
            <span>The Bride</span>
            <strong>NguyenLeThienKim</strong>
          </figcaption>
        </figure>
        <figure>
          <img src="/wedding/assets/groom-frame.png" alt="Portrait of the groom Nguyen Dang Nguyen">
          <figcaption>
            <span>The Groom</span>
            <strong>NguyenDangNguyen</strong>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="invite-section invite-card invite-invitation" aria-labelledby="invitation-title">
      <h2 id="invitation-title">INVITATION</h2>
      <div class="parents-grid">
        <div>
          <span>Mr &amp; Mrs</span>
          <p>Mr. Nguyen Trong Tri<br>Mrs. Bui Viet Hong Duc</p>
        </div>
        <div>
          <span>Mr &amp; Mrs</span>
          <p>Mr. Nguyen Xuan Hoa<br>Mrs. Nguyen Le Kim Cuong</p>
        </div>
      </div>
      <p class="invitation-intro">TOGETHER WITH OUR LOVED ONES, WE INVITE YOU TO JOIN US IN CELEBRATING OUR WEDDING DAY</p>
      <h3>NguyenDangNguyen</h3>
      <span>AND</span>
      <h3>NguyenLeThienKim</h3>
      <strong class="invitation-held">HELD AT 17:30</strong>
      <p class="invitation-date">SATURDAY <span class="invitation-date-separator">|</span> 19.12 <span class="invitation-date-separator">|</span> 2026</p>
      <p class="invitation-location">JW MARRIOTT HOTEL &amp; SUITES SAIGON</p>
      <img class="invitation-pin" src="/wedding/assets/pin.png" alt="">
      <span class="invitation-direction">DIRECTION</span>
      <p class="invitation-note">
        Due to the venue's capacity limitations, we kindly invite only the children of our family and closest relatives to join us on this special day. We sincerely appreciate your understanding.
      </p>
      <p class="invitation-rsvp-note">
        Kindly RSVP by <strong>November 1st, 2026</strong><br>so we can finalize our guest count
      </p>
    </section>

    <section class="invite-section invite-timeline" aria-labelledby="timeline-title">
      <h2 id="timeline-title">TIMELINE</h2>
      <p>Day filled with meaningful moments, from our first hello to the final dance.</p>
      <div class="timeline-frame">
        <img src="/wedding/assets/timeline-frame.png" alt="" aria-hidden="true">
        <div class="timeline-milestone timeline-milestone--tea">
          <h3>Tea Ceremony</h3>
          <p>DECEMBER 17<sup>TH</sup> 2026</p>
        </div>
        <div class="timeline-milestone timeline-milestone--wedding">
          <h3>Wedding Day</h3>
          <p>DECEMBER 19<sup>TH</sup> 2026</p>
        </div>
        <div class="timeline-events">
          <article v-for="item in timelineItems" :key="`${item.time}-${item.title}`">
            <time>{{ item.time }}</time>
            <strong>{{ item.title }}</strong>
          </article>
        </div>
      </div>
    </section>

    <section class="invite-section invite-dresscode" aria-labelledby="dresscode-title">
      <h2 id="dresscode-title">DRESSCODE</h2>
      <h3>Formal Attire</h3>
      <p class="dresscode-intro">We kindly ask you to dress formally to join us on this very special day.</p>
      <div class="dress-swatches" aria-label="Suggested dress code colors">
        <span v-for="item in dressColors" :key="item.label" class="dress-swatch">
          <span class="dress-swatch__dot" :style="{ backgroundColor: item.color }" aria-hidden="true"></span>
          <span class="dress-swatch__label">{{ item.label }}</span>
        </span>
      </div>
      <img
        src="/wedding/assets/dress-figures.png"
        alt="Illustration of guests wearing the suggested dress code colors"
        width="250"
        height="206"
      >
      <p class="dresscode-note">We kindly ask our guests to <strong>leave white attire for the bride,</strong><br>and choose another color to celebrate with us. Thank you!</p>
    </section>

    <section class="invite-section invite-love" aria-labelledby="love-title">
      <h2 id="love-title">LOVE STORY</h2>
      <img
        class="love-story-city"
        src="/wedding/assets/love-story-city.png"
        alt="Illustration of a city bridge by the river"
        width="344"
        height="198"
      >
      <p class="love-story-copy">
        Some love stories begin with a grand moment.<br><br>
        For Nguyen (Andy) &amp; Kim, theirs began rather quietly, with an Instagram connection, two students from Saigon who had both been accepted to Boston University.<br><br>
        What began as conversations about school slowly became walks through the cold Boston nights, shared meals, new cities, and a love that grew quietly with every season.<br><br>
        Through the years, they became each other's home, cheering one another on through dreams, challenges, and all the little moments in between.<br><br>
        After all these years, perhaps their greatest adventure is just beginning...
      </p>
    </section>

    <section id="rsvp" class="invite-section invite-rsvp" aria-labelledby="rsvp-title">
      <h2 id="rsvp-title">RSVP</h2>
      <img class="rsvp-flower" src="/wedding/assets/rsvp-flower.png" alt="" aria-hidden="true" width="150" height="157">
      <form class="invite-form" novalidate @submit.prevent="onSubmit">
        <div v-if="state === 'success'" class="invite-alert invite-alert--success" role="status">
          Thank you, your RSVP has been received.
        </div>

        <div v-if="state === 'error' && !hasValidationErrors" class="invite-alert invite-alert--error" role="alert">
          {{ errorKey === 'forms.status.missingEndpoint' ? 'The RSVP endpoint has not been configured yet.' : 'We could not send your RSVP. Please try again.' }}
        </div>

        <label for="invite-fullName">
          <span>What is your full name? (Required)</span>
          <input
            id="invite-fullName"
            v-model="form.fullName"
            type="text"
            autocomplete="name"
            placeholder="Your full name"
            :aria-invalid="Boolean(errors.fullName)"
            :aria-describedby="errors.fullName ? 'invite-fullName-error' : undefined"
            @blur="touched.fullName = true; validateField('fullName')"
            @input="touched.fullName && validateField('fullName')"
          >
          <small v-if="errors.fullName" id="invite-fullName-error" class="invite-field-error">{{ errors.fullName }}</small>
        </label>

        <label for="invite-preferredName">
          <span>How would you like to be addressed on your name tag? (Required)</span>
          <input
            id="invite-preferredName"
            v-model="form.preferredName"
            type="text"
            placeholder="Your preferred name"
            :aria-invalid="Boolean(errors.preferredName)"
            :aria-describedby="errors.preferredName ? 'invite-preferredName-error' : undefined"
            @blur="touched.preferredName = true; validateField('preferredName')"
            @input="touched.preferredName && validateField('preferredName')"
          >
          <small v-if="errors.preferredName" id="invite-preferredName-error" class="invite-field-error">{{ errors.preferredName }}</small>
        </label>

        <fieldset id="invite-guestOf" class="invite-choice-group invite-choice-group--guest" :aria-invalid="Boolean(errors.guestOf)" :aria-describedby="errors.guestOf ? 'invite-guestOf-error' : undefined">
          <legend>Whose guest are you? (Required)</legend>
          <label>
            <input v-model="form.guestOf" type="radio" name="guestOf" value="brideGroom" @change="touched.guestOf = true; validateField('guestOf')">
            <span>The Bride &amp; Groom</span>
          </label>
          <label>
            <input v-model="form.guestOf" type="radio" name="guestOf" value="brideParents" @change="touched.guestOf = true; validateField('guestOf')">
            <span>The Bride's Parents</span>
          </label>
          <label>
            <input v-model="form.guestOf" type="radio" name="guestOf" value="groomParents" @change="touched.guestOf = true; validateField('guestOf')">
            <span>The Groom's Parents</span>
          </label>
          <small v-if="errors.guestOf" id="invite-guestOf-error" class="invite-field-error">{{ errors.guestOf }}</small>
        </fieldset>

        <label for="invite-email">
          <span>Email (Required)</span>
          <input
            id="invite-email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            placeholder="Your Email"
            :aria-invalid="Boolean(errors.email)"
            :aria-describedby="errors.email ? 'invite-email-error' : undefined"
            @blur="touched.email = true; validateField('email')"
            @input="touched.email && validateField('email')"
          >
          <small v-if="errors.email" id="invite-email-error" class="invite-field-error">{{ errors.email }}</small>
        </label>

        <label for="invite-phone">
          <span>Contact number (country code, e.g +84) (Required)</span>
          <input
            id="invite-phone"
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            placeholder="Your number"
            :aria-invalid="Boolean(errors.phone)"
            :aria-describedby="errors.phone ? 'invite-phone-error' : undefined"
            @blur="touched.phone = true; validateField('phone')"
            @input="touched.phone && validateField('phone')"
          >
          <small v-if="errors.phone" id="invite-phone-error" class="invite-field-error">{{ errors.phone }}</small>
        </label>

        <fieldset id="invite-attendance" class="invite-choice-group invite-choice-group--attendance" :aria-invalid="Boolean(errors.attendance)" :aria-describedby="errors.attendance ? 'invite-attendance-error' : undefined">
          <legend>Will you be attending? (Required)</legend>
          <label>
            <input
              v-model="form.attendance"
              type="radio"
              name="attendance"
              value="yes"
              @change="touched.attendance = true; validateField('attendance')"
            >
            <span>Joyfully Accept</span>
          </label>
          <label>
            <input
              v-model="form.attendance"
              type="radio"
              name="attendance"
              value="no"
              @change="touched.attendance = true; validateField('attendance')"
            >
            <span>Regretfully Decline</span>
          </label>
          <small v-if="errors.attendance" id="invite-attendance-error" class="invite-field-error">{{ errors.attendance }}</small>
        </fieldset>

        <fieldset class="invite-choice-group invite-choice-group--plus-one">
          <legend>Will you be bringing a plus one? If yes, please share their name</legend>
          <label>
            <input v-model="form.plusOneAttendance" type="radio" name="plusOneAttendance" value="yes">
            <span>Yes</span>
          </label>
          <label>
            <input v-model="form.plusOneAttendance" type="radio" name="plusOneAttendance" value="no">
            <span>No</span>
          </label>
        </fieldset>

        <label v-if="form.plusOneAttendance !== 'no'" for="invite-plusOne">
          <input id="invite-plusOne" v-model="form.plusOne" type="text" placeholder="Their name">
        </label>

        <label for="invite-dietary">
          <span>Allergies or dietary requirements</span>
            <input id="invite-dietary" v-model="form.dietary" type="text" placeholder="e.g. gluten-free, lactose intolerant, ...">
        </label>

        <input v-model="form.website" class="honeypot-field" type="text" tabindex="-1" autocomplete="off" aria-label="Website">

        <button class="invite-submit" type="submit" :disabled="isLoading" :aria-busy="isLoading">
          <span class="invite-submit__label">{{ isLoading ? 'SENDING...' : 'SEND RSVP' }}</span>
        </button>
      </form>
      <img class="rsvp-swans" src="/wedding/assets/rsvp-swans.png" alt="" aria-hidden="true" width="175" height="92">
    </section>

    <section class="invite-section invite-album" aria-labelledby="album-title">
      <h2 id="album-title">OUR ALBUM</h2>
      <div
        class="album-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Wedding photo album"
        tabindex="0"
        @focusin="stopAlbumAutoplay"
        @focusout="startAlbumAutoplay"
        @mouseenter="stopAlbumAutoplay"
        @mouseleave="startAlbumAutoplay"
        @keydown="onAlbumKeydown"
        @pointerdown="onAlbumPointerDown"
        @pointerup="onAlbumPointerUp"
        @pointercancel="albumPointerStartX = null; startAlbumAutoplay()"
      >
        <div class="album-carousel__viewport">
          <button
            v-for="(image, index) in albumImages"
            :key="image.src"
            class="album-carousel__slide"
            :class="{
              'is-active': index === activeAlbumIndex,
              'is-previous': index === previousAlbumIndex,
              'is-next': index === nextAlbumIndex
            }"
            type="button"
            :aria-label="`Show photo ${index + 1} of ${albumImages.length}: ${image.alt}`"
            :aria-current="index === activeAlbumIndex ? 'true' : undefined"
            @click="onAlbumSlideClick(index, $event)"
          >
            <img
              :src="image.src"
              :alt="index === activeAlbumIndex ? image.alt : ''"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : undefined"
            >
          </button>
        </div>

        <button class="album-carousel__control album-carousel__control--previous" type="button" aria-label="Show previous photo" @click="showPreviousAlbumSlide">
          <ChevronLeft aria-hidden="true" />
        </button>
        <button class="album-carousel__control album-carousel__control--next" type="button" aria-label="Show next photo" @click="showNextAlbumSlide">
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <p class="invite-album__caption">A collection of little moments, beautiful memories, and everything in between.</p>
    </section>

    <footer class="invite-section invite-footer">
      <h2>CONTACT US</h2>
      <p class="invite-footer__contact-copy"><em>We hope you can make it</em><br>Please reach out to the Bride or Groom<br>via Whatsapp, Zalo:</p>
      <address class="invite-footer__contacts">
        <span>Kim - <em>the Bride</em></span>
        <a href="tel:0909385561">0909 385 561</a>
        <span>Nguyen (Andy) - <em>the Groom</em></span>
        <a href="tel:0942024002">0942 024 002</a>
      </address>
      <section class="invite-footer__thanks" aria-labelledby="thanks-title">
        <h2 id="thanks-title">THANK YOU</h2>
        <p>Having you with us on our special day would mean the world<br>to us and our families.</p>
        <p class="invite-footer__signoff">With love and gratitude,<br>thank you for celebrating with us.</p>
        <img src="/wedding/assets/thank-you-florals.png" alt="" aria-hidden="true" width="278" height="155">
      </section>
    </footer>
  </div>
</template>
