## Why

The current Nuxt wedding page is a good visual seed, but it is still a single-language static landing page without the key invitation flows guests need: bilingual content, countdown/calendar, gallery, wishes, and RSVP. This change turns the repo into a polished static wedding website that can be generated with Nuxt and collect guest responses without exposing credentials.

## What Changes

- Build a mobile-first, luxury romantic wedding invitation experience inspired by the reference site mood, while using original implementation, layout decisions, and local/project-owned assets.
- Add full Vietnamese and English localization with Vietnamese as the default locale.
- Expand the page into reusable Vue components for hero, event details, countdown, calendar, timeline, love story, album/gallery, wishes, RSVP, locale switching, and shared section UI.
- Add smooth scroll reveal and staggered section animations that respect `prefers-reduced-motion`.
- Replace the mailto RSVP placeholder with first-class wish and RSVP forms.
- Submit wish and RSVP data to a configurable Google Apps Script Web App endpoint, or compatible endpoint configured through runtime config.
- Keep all Google credentials and private secrets out of the client bundle.
- Add validation, loading, success, and error states for guest-facing forms, including a clear configuration error when no endpoint is available.
- Preserve static generation via `nuxt generate` and ensure the generated output can be deployed to static hosting.

## Capabilities

### New Capabilities

- `static-wedding-site`: Covers the generated Nuxt wedding invitation experience, reusable page sections, responsive layout, media/gallery behavior, countdown/calendar, animation, and static build requirements.
- `wedding-localization`: Covers Vietnamese/English localization behavior, route strategy, locale switching, localized SEO, and user-facing text ownership.
- `guest-submissions`: Covers wish and RSVP form behavior, validation, submission transport, Google Sheets-compatible endpoint integration, runtime configuration, and client-side secret handling.

### Modified Capabilities

- None.

## Impact

- Affects the Nuxt app shell, main page composition, component structure, composables, static assets, global styling, runtime config, and build configuration.
- Adds an i18n dependency such as `@nuxtjs/i18n` and may add small client-side utilities only where they reduce custom code.
- Requires an externally deployed Google Apps Script Web App, or a compatible HTTPS endpoint, to receive form submissions from the static site.
- Requires documentation for endpoint setup, expected Google Sheet columns, and environment/runtime config values.
