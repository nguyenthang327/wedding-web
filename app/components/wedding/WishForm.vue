<script setup lang="ts">
const { t, locale } = useI18n()
const { state, errorKey, isLoading, reset, submit } = useSheetSubmit()

const formStartedAt = ref(Date.now())
const errorSummary = ref<HTMLDivElement | null>(null)
const form = reactive({
  name: '',
  message: '',
  website: ''
})

const touched = reactive({
  name: false,
  message: false
})

const errors = reactive({
  name: '',
  message: ''
})

const visibleErrors = computed(() =>
  Object.entries(errors).filter((entry): entry is [keyof typeof errors, string] => Boolean(entry[1]))
)

const hasValidationErrors = computed(() => visibleErrors.value.length > 0)

const validateField = (field: keyof typeof errors) => {
  if (field === 'name') {
    errors.name = form.name.trim() ? '' : 'forms.validation.nameRequired'
  }

  if (field === 'message') {
    errors.message = form.message.trim() ? '' : 'forms.validation.messageRequired'
  }
}

const validate = () => {
  validateField('name')
  validateField('message')
  return !hasValidationErrors.value
}

const focusErrorSummary = async () => {
  await nextTick()
  errorSummary.value?.focus()
}

const resetForm = () => {
  form.name = ''
  form.message = ''
  form.website = ''
  touched.name = false
  touched.message = false
  errors.name = ''
  errors.message = ''
  formStartedAt.value = Date.now()
}

const onSubmit = async () => {
  reset()
  touched.name = true
  touched.message = true

  if (!validate()) {
    await focusErrorSummary()
    return
  }

  const result = await submit({
    submissionType: 'wish',
    submissionId: createSubmissionId(),
    locale: locale.value,
    createdAt: new Date().toISOString(),
    pageUrl: import.meta.client ? window.location.href : '',
    honeypot: form.website,
    elapsedMs: Date.now() - formStartedAt.value,
    name: form.name.trim(),
    message: form.message.trim()
  })

  if (result.ok) {
    resetForm()
  }
}
</script>

<template>
  <form class="guest-form" novalidate @submit.prevent="onSubmit">
    <div class="guest-form__intro">
      <h3>{{ t('forms.wish.title') }}</h3>
      <p>{{ t('forms.wish.description') }}</p>
    </div>

    <div
      v-if="hasValidationErrors"
      ref="errorSummary"
      class="form-alert form-alert--error"
      role="alert"
      tabindex="-1"
    >
      <h4>{{ t('forms.status.errorTitle') }}</h4>
      <a v-for="[field, fieldError] in visibleErrors" :key="field" :href="`#wish-${field}`">
        {{ t(fieldError) }}
      </a>
    </div>

    <div v-if="state === 'success'" class="form-alert form-alert--success" role="status">
      {{ t('forms.status.wishSuccess') }}
    </div>

    <div v-if="state === 'error' && !hasValidationErrors" class="form-alert form-alert--error" role="alert">
      {{ t(errorKey) }}
    </div>

    <label class="field" for="wish-name">
      <span>{{ t('forms.fields.name') }}</span>
      <input
        id="wish-name"
        v-model="form.name"
        type="text"
        autocomplete="name"
        :placeholder="t('forms.placeholders.name')"
        :aria-invalid="Boolean(errors.name)"
        :aria-describedby="errors.name ? 'wish-name-error' : undefined"
        @blur="touched.name = true; validateField('name')"
      >
      <small v-if="touched.name && errors.name" id="wish-name-error" class="field-error">
        {{ t(errors.name) }}
      </small>
    </label>

    <label class="field" for="wish-message">
      <span>{{ t('forms.fields.message') }}</span>
      <textarea
        id="wish-message"
        v-model="form.message"
        rows="5"
        :placeholder="t('forms.placeholders.message')"
        :aria-invalid="Boolean(errors.message)"
        :aria-describedby="errors.message ? 'wish-message-error' : undefined"
        @blur="touched.message = true; validateField('message')"
      />
      <small v-if="touched.message && errors.message" id="wish-message-error" class="field-error">
        {{ t(errors.message) }}
      </small>
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
      {{ isLoading ? t('forms.status.loading') : t('forms.wish.submit') }}
    </button>
  </form>
</template>
