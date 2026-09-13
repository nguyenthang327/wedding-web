export type SubmissionType = 'wish' | 'rsvp'

export type GuestSubmissionPayload = {
  submissionType: SubmissionType
  createdAt: string
  name: string
  submissionId?: string
  pageUrl?: string
  honeypot?: string
  elapsedMs?: number
  message?: string
  attending?: 'yes' | 'no'
  guestCount?: number
  contact?: string
  email?: string
  phone?: string
  preferredName?: string
  guestOf?: string
  plusOneAttendance?: 'yes' | 'no' | ''
  plusOne?: string
  dietary?: string
  note?: string
}

export type SubmissionState = 'idle' | 'loading' | 'success' | 'error'

type SubmitResult =
  | { ok: true }
  | { ok: false; errorKey: string }

export function createSubmissionId() {
  if (import.meta.client && window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function useSheetSubmit() {
  const config = useRuntimeConfig()
  const state = ref<SubmissionState>('idle')
  const errorKey = ref('')

  const isLoading = computed(() => state.value === 'loading')

  const reset = () => {
    state.value = 'idle'
    errorKey.value = ''
  }

  const submit = async (payload: GuestSubmissionPayload): Promise<SubmitResult> => {
    const endpoint = String(config.public.submissionsEndpoint || '').trim()

    if (!endpoint) {
      state.value = 'error'
      errorKey.value = 'forms.status.missingEndpoint'
      return { ok: false, errorKey: errorKey.value }
    }

    state.value = 'loading'
    errorKey.value = ''

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload),
        redirect: 'follow'
      })

      if (!response.ok) {
        throw new Error(`Submission failed with ${response.status}`)
      }

      const responseText = await response.text()
      if (responseText.trim().startsWith('{')) {
        const responseJson = JSON.parse(responseText) as { ok?: boolean; error?: string }
        if (responseJson.ok === false) {
          throw new Error(responseJson.error || 'Submission rejected')
        }
      }

      state.value = 'success'
      return { ok: true }
    } catch {
      state.value = 'error'
      errorKey.value = 'forms.status.submitError'
      return { ok: false, errorKey: errorKey.value }
    }
  }

  return {
    state,
    errorKey,
    isLoading,
    reset,
    submit
  }
}
