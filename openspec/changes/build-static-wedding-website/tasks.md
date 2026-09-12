## 1. Setup And Guardrails

- [x] 1.1 Run GitNexus impact analysis for existing symbols/files that will be edited and record any HIGH/CRITICAL risk before making code changes.
- [x] 1.2 Add required dependencies, including Nuxt i18n, while avoiding optional motion/gallery libraries unless implementation proves they are needed.
- [x] 1.3 Configure Nuxt runtime config for a public submissions endpoint such as `NUXT_PUBLIC_SUBMISSIONS_ENDPOINT`.
- [x] 1.4 Configure static prerendering so the Vietnamese default route and English route are included in generated output.

## 2. Content, Data, And Localization

- [x] 2.1 Create typed wedding configuration for event date, timezone, venue, map URL, image paths, and non-prose identifiers.
- [x] 2.2 Create Vietnamese and English locale files for all user-facing text, including SEO copy, navigation, sections, image alt text, forms, validation, and status messages.
- [x] 2.3 Configure `@nuxtjs/i18n` with Vietnamese as the default locale and English as the secondary locale.
- [x] 2.4 Implement localized SEO metadata and document language behavior for each locale route.
- [x] 2.5 Add a keyboard-accessible locale switcher that changes between Vietnamese and English routes.

## 3. Page Composition And Visual Sections

- [x] 3.1 Refactor `app/pages/index.vue` into a thin composer that delegates major sections to wedding components.
- [x] 3.2 Implement `WeddingHero`, `EventDetails`, `SectionHeading`, and thank-you/footer components using the existing visual mood and project-owned assets.
- [x] 3.3 Implement `CountdownTimer` and its composable with future and completed states that avoid hydration mismatch.
- [x] 3.4 Implement `CalendarCard` that highlights the configured wedding day accessibly.
- [x] 3.5 Implement `TimelineSection` and `LoveStory` with localized content and responsive layouts.
- [x] 3.6 Implement `AlbumGallery` with responsive image layout, lazy loading, stable aspect ratios, alt text, and keyboard-usable lightbox behavior if lightbox is included.

## 4. Motion And Interaction Polish

- [x] 4.1 Implement reduced-motion detection in a reusable composable or utility.
- [x] 4.2 Add scroll reveal behavior for sections using CSS and IntersectionObserver.
- [x] 4.3 Add subtle stagger animation for timeline and gallery items.
- [x] 4.4 Ensure interactive controls have visible focus states, hover/active feedback, and touch targets of at least 44px.
- [x] 4.5 Verify reduced-motion mode renders content in its final readable state without decorative movement.

## 5. Guest Forms And Google Sheets Integration

- [x] 5.1 Implement a reusable `useSheetSubmit` composable that submits to the configured public endpoint and handles missing endpoint, loading, success, and error states.
- [x] 5.2 Implement `WishForm` with localized labels, validation, accessible errors, preserved values on failure, and the expected wish payload.
- [x] 5.3 Implement `RsvpForm` with localized labels, validation, accessible errors, preserved values on failure, and the expected RSVP payload.
- [x] 5.4 Add duplicate-submit prevention while each form is loading, keeping wish and RSVP state independent.
- [x] 5.5 Include submission metadata such as submission id, locale, timestamp, page URL, honeypot value, and elapsed time.
- [x] 5.6 Document the Google Apps Script-compatible endpoint contract, expected `wishes` and `rsvps` Sheet tabs, columns, and environment variable setup.

## 6. Verification

- [x] 6.1 Run `yarn dev` and smoke-test the default Vietnamese route and English route.
- [x] 6.2 Run `yarn generate` and verify static generation succeeds.
- [x] 6.3 Verify all user-facing strings in page and component templates resolve through locale files.
- [x] 6.4 Verify forms show a clear localized configuration error and do not crash when the submissions endpoint is missing.
- [x] 6.5 Verify normal browsing, locale switching, scrolling, gallery interaction, and form interaction produce no uncaught browser console errors.
- [x] 6.6 Verify responsive layout quality at 375px, 768px, 1024px, and 1440px.
- [x] 6.7 Inspect generated output for absence of Google credentials or private secrets.
- [x] 6.8 Run GitNexus `detect_changes()` or CLI equivalent before committing to confirm the affected scope matches the planned change.
