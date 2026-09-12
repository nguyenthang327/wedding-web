<script setup lang="ts">
type AttendanceValue = '' | 'yes' | 'no'

const { t, locale } = useI18n()
const { state, errorKey, isLoading, reset, submit } = useSheetSubmit()

const formStartedAt = ref(Date.now())
const errorSummary = ref<HTMLDivElement | null>(null)
const form = reactive({
  name: '',
  attending: '' as AttendanceValue,
  guestCount: 1,
  contact: '',
  note: '',
  website: ''
})

const touched = reactive({
  name: false,
  attending: false,
  guestCount: false,
  contact: false
})

const errors = reactive({
  name: '',
  attending: '',
  guestCount: '',
  contact: ''
})

const visibleErrors = computed(() =>
  Object.entries(errors).filter((entry): entry is [keyof typeof errors, string] => Boolean(entry[1]))
)

const hasValidationErrors = computed(() => visibleErrors.value.length > 0)

const validateField = (field: keyof typeof errors) => {
  if (field === 'name') {
    errors.name = form.name.trim() ? '' : 'forms.validation.nameRequired'
  }

  if (field === 'attending') {
    errors.attending = form.attending ? '' : 'forms.validation.attendanceRequired'
  }

  if (field === 'guestCount') {
    const guestCount = Number(form.guestCount)
    errors.guestCount =
      form.attending === 'yes' && (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10)
        ? 'forms.validation.guestCountInvalid'
        : ''
  }

  if (field === 'contact') {
    errors.contact = form.contact.trim() ? '' : 'forms.validation.contactRequired'
  }
}

const validate = () => {
  validateField('name')
  validateField('attending')
  validateField('guestCount')
  validateField('contact')
  return !hasValidationErrors.value
}

const focusErrorSummary = async () => {
  await nextTick()
  errorSummary.value?.focus()
}

const resetForm = () => {
  form.name = ''
  form.attending = ''
  form.guestCount = 1
  form.contact = ''
  form.note = ''
  form.website = ''
  touched.name = false
  touched.attending = false
  touched.guestCount = false
  touched.contact = false
  errors.name = ''
  errors.attending = ''
  errors.guestCount = ''
  errors.contact = ''
  formStartedAt.value = Date.now()
}

const onSubmit = async () => {
  reset()
  touched.name = true
  touched.attending = true
  touched.guestCount = true
  touched.contact = true

  if (!validate()) {
    await focusErrorSummary()
    return
  }

  const result = await submit({
    submissionType: 'rsvp',
    submissionId: createSubmissionId(),
    locale: locale.value,
    createdAt: new Date().toISOString(),
    pageUrl: import.meta.client ? window.location.href : '',
    honeypot: form.website,
    elapsedMs: Date.now() - formStartedAt.value,
    name: form.name.trim(),
    attending: form.attending || undefined,
    guestCount: form.attending === 'yes' ? Number(form.guestCount) : 0,
    contact: form.contact.trim(),
    note: form.note.trim()
  })

  if (result.ok) {
    resetForm()
  }
}
</script>

<template>
  <form class="guest-form" novalidate @submit.prevent="onSubmit">
    <div class="guest-form__intro">
      <h3>{{ t('forms.rsvp.title') }}</h3>
      <p>{{ t('forms.rsvp.description') }}</p>
    </div>

    <div
      v-if="hasValidationErrors"
      ref="errorSummary"
      class="form-alert form-alert--error"
      role="alert"
      tabindex="-1"
    >
      <h4>{{ t('forms.status.errorTitle') }}</h4>
      <a v-for="[field, fieldError] in visibleErrors" :key="field" :href="`#rsvp-${field}`">
        {{ t(fieldError) }}
      </a>
    </div>

    <div v-if="state === 'success'" class="form-alert form-alert--success" role="status">
      {{ t('forms.status.rsvpSuccess') }}
    </div>

    <div v-if="state === 'error' && !hasValidationErrors" class="form-alert form-alert--error" role="alert">
      {{ t(errorKey) }}
    </div>

    <label class="field" for="rsvp-name">
      <span>{{ t('forms.fields.name') }}</span>
      <input
        id="rsvp-name"
        v-model="form.name"
        type="text"
        autocomplete="name"
        :placeholder="t('forms.placeholders.name')"
        :aria-invalid="Boolean(errors.name)"
        :aria-describedby="errors.name ? 'rsvp-name-error' : undefined"
        @blur="touched.name = true; validateField('name')"
      >
      <small v-if="touched.name && errors.name" id="rsvp-name-error" class="field-error">
        {{ t(errors.name) }}
      </small>
    </label>

    <fieldset class="field fieldset" :aria-describedby="errors.attending ? 'rsvp-attending-error' : undefined">
      <legend>{{ t('forms.fields.attendance') }}</legend>
      <label class="radio-card" for="rsvp-attending-yes">
        <input
          id="rsvp-attending-yes"
          v-model="form.attending"
          type="radio"
          name="attending"
          value="yes"
          @change="touched.attending = true; validateField('attending'); validateField('guestCount')"
        >
        <span>{{ t('forms.fields.attendingYes') }}</span>
      </label>
      <label class="radio-card" for="rsvp-attending-no">
        <input
          id="rsvp-attending-no"
          v-model="form.attending"
          type="radio"
          name="attending"
          value="no"
          @change="touched.attending = true; validateField('attending'); validateField('guestCount')"
        >
        <span>{{ t('forms.fields.attendingNo') }}</span>
      </label>
      <small v-if="touched.attending && errors.attending" id="rsvp-attending-error" class="field-error">
        {{ t(errors.attending) }}
      </small>
    </fieldset>

    <label v-if="form.attending !== 'no'" class="field" for="rsvp-guestCount">
      <span>{{ t('forms.fields.guestCount') }}</span>
      <input
        id="rsvp-guestCount"
        v-model.number="form.guestCount"
        type="number"
        min="1"
        max="10"
        inputmode="numeric"
        :placeholder="t('forms.placeholders.guestCount')"
        :aria-invalid="Boolean(errors.guestCount)"
        :aria-describedby="errors.guestCount ? 'rsvp-guestCount-error' : undefined"
        @blur="touched.guestCount = true; validateField('guestCount')"
      >
      <small v-if="touched.guestCount && errors.guestCount" id="rsvp-guestCount-error" class="field-error">
        {{ t(errors.guestCount) }}
      </small>
    </label>

    <label class="field" for="rsvp-contact">
      <span>{{ t('forms.fields.contact') }}</span>
      <input
        id="rsvp-contact"
        v-model="form.contact"
        type="text"
        autocomplete="email"
        :placeholder="t('forms.placeholders.contact')"
        :aria-invalid="Boolean(errors.contact)"
        :aria-describedby="errors.contact ? 'rsvp-contact-error' : undefined"
        @blur="touched.contact = true; validateField('contact')"
      >
      <small v-if="touched.contact && errors.contact" id="rsvp-contact-error" class="field-error">
        {{ t(errors.contact) }}
      </small>
    </label>

    <label class="field" for="rsvp-note">
      <span>{{ t('forms.fields.note') }}</span>
      <textarea
        id="rsvp-note"
        v-model="form.note"
        rows="4"
        :placeholder="t('forms.placeholders.note')"
      />
    </label>

    <input
      v-model="form.website"
      class="honeypot-field"
      type="text"
      tabindex="-1"
      autocomplete="off"
      :aria-label="t('forms.fields.honeypot')"
    >

    <button class="button button--primary" type="submit" :disabled="isLoading" :aria-busy="isLoading">
      {{ isLoading ? t('forms.status.loading') : t('forms.rsvp.submit') }}
    </button>
  </form>
</template>
