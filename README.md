# wedding-web

Static wedding website built with Nuxt 4 and Yarn. Docker exposes the app on host port `3033` and runs Nuxt on container port `3000`.

## Setup

```bash
yarn install
```

## Development Server

Start the development server locally on `http://localhost:3000`:

```bash
yarn dev
```

## Docker

```bash
docker build -t wedding-web-yarn .
docker run --rm -it -p 3033:3000 -v "$PWD":/app -w /app wedding-web-yarn
```

## Docker Compose

```bash
docker compose up --build
```

The app is available on the host at `http://localhost:3033`. Local Docker settings live in `.env`; use `.env.example` as the committed template.

## Static Build

```bash
yarn generate
yarn preview:static
```

Nuxt writes the deployable static site to `.output/public`.

## Guest Submissions

Wish and RSVP forms post to the public endpoint configured by `NUXT_PUBLIC_SUBMISSIONS_ENDPOINT`. See `docs/google-sheets.md` for the Google Apps Script-compatible payload and Sheet setup.

## GitNexus

```bash
yarn gitnexus:analyze
yarn gitnexus:setup
```

## UI UX Pro Max

The UI/UX skill is available at `.agents/skills/ui-ux-pro-max`.

```bash
yarn uiux:design-system
yarn uiux:nuxt
```

See `docs/integrations.md` for source links, license notes, and extra commands.
