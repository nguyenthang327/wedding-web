## Context

The repository currently contains a Nuxt 4/Vue 3 static-ready app with a single wedding landing page, global CSS, one local hero image, and scripts for `yarn dev` and `yarn generate`. The desired product is a premium, romantic, mobile-first wedding invitation site inspired by the mood of the reference page, without copying its implementation, code, or assets.

The site must remain deployable as static output. Because static hosting cannot keep Google credentials private or execute server-side Sheets writes, guest submissions must go to an external HTTPS endpoint such as a Google Apps Script Web App. The frontend may know the public endpoint URL, but no private credentials or service account secrets can be bundled into client code.

## Goals / Non-Goals

**Goals:**

- Deliver a Nuxt-generated static wedding website with polished invitation sections, bilingual content, reusable components, and smooth interactions.
- Keep Vietnamese as the default locale and expose English through i18n routes and a visible locale switcher.
- Route every user-facing string through locale files, including form labels, validation messages, SEO copy, and status messages.
- Add wish and RSVP forms with validation, loading, success, error, and missing-configuration states.
- Submit form data to a configurable Google Apps Script-compatible endpoint without exposing credentials.
- Maintain responsive quality at 375px, 768px, 1024px, and 1440px.
- Respect `prefers-reduced-motion` for all non-essential animations.

**Non-Goals:**

- Building an admin dashboard, guest management back office, seating chart, invitation-code access control, or public wishes feed.
- Copying the reference page assets, exact layout, generated LadiPage code, or proprietary fonts.
- Implementing a serverful backend inside Nuxt for production static deployment.
- Guaranteeing delivery of email/SMS confirmations or calendar invites.

## Decisions

### Use Nuxt Static Generation As The Primary Delivery Model

The app will continue to use Nuxt 4 with `nuxt generate`, prerendering localized routes into `.output/public`. Client-only behavior will be limited to interactions that require browser APIs: countdown ticking, scroll reveal, gallery lightbox, form validation, and form submission.

Alternatives considered:

- **Nuxt server routes:** rejected for the primary deployment because the target is a static website.
- **A single plain HTML file:** rejected because the repo already uses Nuxt/Vue and needs clean component reuse plus i18n.

### Compose The Page From Wedding-Specific Components

`app/pages/index.vue` should become a thin page composer. Major UI areas should live under `app/components/wedding/`, with small shared pieces such as `SectionHeading`, `LocaleSwitcher`, and form/status primitives reused across the page. Data that is not prose, such as dates, image paths, map URLs, and event identifiers, should live in typed data/composable files. Display text should live in locale JSON files.

Proposed component shape:

```text
app/components/wedding/
  WeddingHero.vue
  CountdownTimer.vue
  CalendarCard.vue
  EventDetails.vue
  TimelineSection.vue
  LoveStory.vue
  AlbumGallery.vue
  WishForm.vue
  RsvpForm.vue
  LocaleSwitcher.vue
  SectionHeading.vue
app/composables/
  useCountdown.ts
  useReducedMotion.ts
  useSheetSubmit.ts
app/data/
  wedding.ts
app/i18n/locales/
  vi.json
  en.json
```

Alternatives considered:

- **Keep all logic in `index.vue`:** faster initially, but it makes localization, form state, and future content changes harder.
- **Introduce a broad component library:** unnecessary for a compact event site; local Vue components and existing Lucide icons are sufficient.

### Add `@nuxtjs/i18n` With Vietnamese Default Locale

Use `@nuxtjs/i18n` for route generation, locale switching, and SEO-aware localization. Vietnamese should be the default locale. English should be available through a localized route such as `/en`. The language switcher should preserve the current section route where practical and must be keyboard accessible.

Alternatives considered:

- **Manual locale state:** rejected because route generation, SEO metadata, and static prerendering become easier to break.
- **Browser-only translation toggle:** rejected because generated English URLs and shareable localized metadata are acceptance criteria.

### Use A Public Submission Endpoint With A Narrow Client Contract

The frontend will submit to a runtime-configured public endpoint, for example `runtimeConfig.public.submissionsEndpoint` sourced from `NUXT_PUBLIC_SUBMISSIONS_ENDPOINT`. This value is not a secret. The endpoint should accept JSON-compatible payloads for `wish` and `rsvp` submission types and write to the appropriate Google Sheet tabs.

To improve compatibility with Google Apps Script Web Apps, `useSheetSubmit` should avoid custom authentication headers and should support a payload format that does not require exposing secrets. The client contract should include:

- `submissionType`: `wish` or `rsvp`
- `submissionId`: browser-generated unique identifier
- `locale`
- `createdAt`: ISO timestamp
- `pageUrl`
- form-specific fields
- anti-spam metadata such as honeypot and elapsed time

If no endpoint is configured, forms must not crash or silently pretend success. They should show a localized configuration error and keep entered values.

Alternatives considered:

- **Direct Google Sheets API from browser:** rejected because it would expose credentials or require end-user OAuth.
- **Serverless relay first:** viable and more controllable, but heavier than needed for the first wedding-site scope. The submission composable keeps this upgrade path open.

### Favor CSS And IntersectionObserver For Motion

Use CSS transitions/animations plus IntersectionObserver-driven reveal classes for section entrances, timeline/gallery stagger, and button interactions. Add a `useReducedMotion` composable so reduced-motion users see the final state without decorative movement. Introduce GSAP or another motion library only if a later implementation task proves CSS/IntersectionObserver insufficient.

Alternatives considered:

- **GSAP by default:** powerful, but adds dependency and bundle weight for motion that can be achieved with native APIs.
- **No animation:** misses the desired romantic invitation feel and reference-site mood.

### Optimize Images And Layout Stability

Hero and album images should use project-owned assets, explicit dimensions or aspect ratios, lazy loading where appropriate, and meaningful alt text. Gallery layout should reserve space before images load to avoid layout shift. Lightbox behavior, if implemented, must be keyboard reachable and closable.

Alternatives considered:

- **Hotlink reference images:** rejected because the site must not copy assets and external availability cannot be controlled.
- **Full carousel-only album:** less scannable on mobile; a responsive grid with optional lightbox is more reliable.

## Risks / Trade-offs

- Google Apps Script endpoint can receive spam or malformed requests -> Add honeypot, elapsed-time checks, server-side validation expectations, and clear documentation for Sheet columns.
- Apps Script cross-origin behavior can be finicky across hosting providers -> Keep the client transport simple, document endpoint requirements, and preserve entered values on transport failure.
- Countdown can create hydration mismatch because time changes between prerender and hydration -> Render a stable initial state and start ticking only on the client.
- Album images can slow the first load -> Lazy-load non-hero images, size assets before use, and avoid loading all lightbox detail upfront.
- Animation can harm accessibility or performance -> Respect `prefers-reduced-motion`, animate transform/opacity only, and avoid scroll-jacking.
- Locale routes can be missed during static generation -> Configure i18n/prerender so `/` and `/en` are generated and validated.

## Migration Plan

1. Add i18n configuration, locale files, and localized route generation.
2. Move existing single-page content into reusable wedding components.
3. Add countdown, calendar, story, timeline, album, wish form, and RSVP form.
4. Add submission composable and runtime endpoint configuration.
5. Document Google Apps Script deployment, expected tabs/columns, and environment variables.
6. Validate with `yarn dev`, `yarn generate`, responsive checks, and runtime console checks.

Rollback is straightforward because the generated site remains static: revert the change or deploy the previous `.output/public` artifact. If the external endpoint fails, the static page should still render and forms should show a localized configuration or submission error.

## Open Questions

- What final couple names, dates, venue details, map URL, and album assets should replace placeholder content?
- Should English use `/en` only, or should Vietnamese also have an explicit `/vi` route?
- Should successful submissions display only an inline success message, or also reset the form after success?
- Should the first implementation include a sample Apps Script file in the repo docs for easier setup?
