# Google Sheets Submission Endpoint

The wedding site is generated as static HTML, so it cannot safely hold Google credentials or write directly to Google Sheets from a private server route. Configure a public HTTPS endpoint with:

```bash
NUXT_PUBLIC_SUBMISSIONS_ENDPOINT="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

This URL is public by design. Do not put service account keys, OAuth client secrets, spreadsheet edit tokens, or other private credentials in any `NUXT_PUBLIC_*` value.

## Sheet Structure

Create a Google Sheet with two tabs.

`wishes`

```text
created_at | locale | submission_id | page_url | name | message | elapsed_ms | honeypot
```

`rsvps`

```text
created_at | locale | submission_id | page_url | name | attending | guest_count | contact | note | elapsed_ms | honeypot
```

## Expected Request

The frontend sends a POST request with `Content-Type: text/plain;charset=utf-8` and a JSON string body. The payload contains common metadata plus fields for each form.

Wish payload:

```json
{
  "submissionType": "wish",
  "submissionId": "uuid",
  "locale": "vi",
  "createdAt": "2026-08-27T00:00:00.000Z",
  "pageUrl": "https://example.com/",
  "honeypot": "",
  "elapsedMs": 4500,
  "name": "Minh Anh",
  "message": "Congratulations!"
}
```

RSVP payload:

```json
{
  "submissionType": "rsvp",
  "submissionId": "uuid",
  "locale": "vi",
  "createdAt": "2026-08-27T00:00:00.000Z",
  "pageUrl": "https://example.com/",
  "honeypot": "",
  "elapsedMs": 5300,
  "name": "Minh Anh",
  "attending": "yes",
  "guestCount": 2,
  "contact": "minh@example.com",
  "note": "Vegetarian meal"
}
```

## Apps Script Example

Create an Apps Script bound to the spreadsheet, deploy it as a Web App, and allow access for guests who will submit the form.

```javascript
const SHEETS = {
  wish: 'wishes',
  rsvp: 'rsvps'
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}')
    validatePayload(payload)

    if (payload.honeypot || Number(payload.elapsedMs || 0) < 1200) {
      return jsonResponse({ ok: true })
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS[payload.submissionType])
    if (!sheet) {
      throw new Error('Missing target sheet')
    }

    if (payload.submissionType === 'wish') {
      sheet.appendRow([
        payload.createdAt,
        payload.locale,
        payload.submissionId,
        payload.pageUrl,
        payload.name,
        payload.message,
        payload.elapsedMs,
        payload.honeypot
      ])
    }

    if (payload.submissionType === 'rsvp') {
      sheet.appendRow([
        payload.createdAt,
        payload.locale,
        payload.submissionId,
        payload.pageUrl,
        payload.name,
        payload.attending,
        payload.guestCount,
        payload.contact,
        payload.note,
        payload.elapsedMs,
        payload.honeypot
      ])
    }

    return jsonResponse({ ok: true })
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error && error.message ? error.message : error) })
  }
}

function validatePayload(payload) {
  if (!payload || !SHEETS[payload.submissionType]) {
    throw new Error('Invalid submission type')
  }

  if (!payload.name) {
    throw new Error('Missing name')
  }

  if (payload.submissionType === 'wish' && !payload.message) {
    throw new Error('Missing message')
  }

  if (payload.submissionType === 'rsvp' && !payload.attending) {
    throw new Error('Missing attendance')
  }
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON)
}
```

If the Apps Script deployment cannot be read by browser `fetch` due to cross-origin restrictions in a given host/browser combination, keep this same request contract and put a small relay such as a Cloudflare Worker or Netlify Function in front of the Sheet writer.
