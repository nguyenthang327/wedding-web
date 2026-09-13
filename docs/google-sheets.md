# Google Sheets RSVP Endpoint

The wedding site is generated as static HTML, so it cannot safely hold Google credentials or write directly to Google Sheets from a private server route. Configure a public HTTPS endpoint with:

```bash
NUXT_PUBLIC_SUBMISSIONS_ENDPOINT="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

This URL is public by design. Do not put service account keys, OAuth client secrets, spreadsheet edit tokens, or other private credentials in any `NUXT_PUBLIC_*` value.

## Sheet Structure

Use a single `rsvps` tab.

```text
Created at | Name | Preferred name | Guest of | Attending | Email | Phone | Plus one | Plus one name | Dietary
```

The frontend no longer sends `locale`, `submission_id`, `page_url`, `guest_count`, `elapsed_ms`, `honeypot`, or a combined `contact` field. Email and phone are sent as separate fields. The `phone` column is formatted as plain text so values such as `09123123123` and `+849123123123` stay readable.

## Expected Request

The frontend sends a POST request with `Content-Type: text/plain;charset=utf-8` and a JSON string body.

```json
{
  "submissionType": "rsvp",
  "createdAt": "2026/09/12 17:03",
  "name": "Thang Nguyen Duc",
  "preferredName": "Thang Nguyen Duc",
  "guestOf": "The Bride & Groom",
  "attending": "yes",
  "email": "guest@example.com",
  "phone": "+849123123123",
  "plusOneAttendance": "yes",
  "plusOne": "Tien anh, a, b",
  "dietary": "Ca rot"
}
```

## Apps Script

Create an Apps Script bound to the spreadsheet, paste this script, run `setupRsvpSheet` once, then deploy it as a Web App. Set access to `Anyone`.

```javascript
const RSVP_SHEET_NAME = 'rsvps'
const WISHES_SHEET_NAME = 'wishes'
const RSVP_HEADERS = [
  'Created at',
  'Name',
  'Preferred name',
  'Guest of',
  'Attending',
  'Email',
  'Phone',
  'Plus one',
  'Plus one name',
  'Dietary'
]

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || '{}')
    validatePayload(payload)

    const sheet = setupRsvpSheet()
    sheet.getRange('G:G').setNumberFormat('@')
    sheet.appendRow([
      formatSheetDateTime(payload.createdAt),
      payload.name || '',
      payload.preferredName || '',
      formatGuestOf(payload.guestOf),
      formatAttendance(payload.attending),
      payload.email || '',
      formatPhone(payload.phone),
      formatYesNo(payload.plusOneAttendance),
      payload.plusOne || '',
      payload.dietary || ''
    ])
    formatRsvpSheet(sheet)

    return jsonResponse({ ok: true })
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error && error.message ? error.message : error) })
  }
}

function setupRsvpSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = getOrCreateRsvpSheet(spreadsheet)
  migrateRsvpSheet(sheet)
  deleteWishesSheet(spreadsheet)
  formatRsvpSheet(sheet)
  return sheet
}

function getOrCreateRsvpSheet(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(RSVP_SHEET_NAME)
  if (sheet) {
    return sheet
  }

  const activeSheet = spreadsheet.getActiveSheet()
  if (activeSheet && spreadsheet.getSheets().length === 1) {
    activeSheet.setName(RSVP_SHEET_NAME)
    return activeSheet
  }

  return spreadsheet.insertSheet(RSVP_SHEET_NAME)
}

function migrateRsvpSheet(sheet) {
  const range = sheet.getDataRange()
  const values = range.getValues()
  const currentHeaders = values[0] ? values[0].map(String) : []

  if (headersMatch(currentHeaders, RSVP_HEADERS)) {
    return
  }

  const mappedRows = values
    .slice(1)
    .filter((row) => row.some((cell) => cell !== ''))
    .map((row) => mapLegacyRsvpRow(currentHeaders, row))

  sheet.clear()
  sheet.getRange('G:G').setNumberFormat('@')
  sheet.getRange(1, 1, 1, RSVP_HEADERS.length).setValues([RSVP_HEADERS])

  if (mappedRows.length) {
    sheet.getRange(2, 1, mappedRows.length, RSVP_HEADERS.length).setValues(mappedRows)
  }
}

function mapLegacyRsvpRow(headers, row) {
  const get = (...names) => {
    const index = names.map((name) => headers.indexOf(name)).find((value) => value >= 0)
    return index === undefined ? '' : row[index]
  }

  const contact = String(get('contact') || '')
  const contactParts = contact.split('|').map((part) => part.trim())
  const note = String(get('note') || '')

  return [
    formatSheetDateTime(get('Created at', 'created_at', 'createdAt')),
    get('Name', 'name'),
    get('Preferred name', 'preferred_name', 'preferredName') || getNoteValue(note, 'Preferred name'),
    formatGuestOf(get('Guest of', 'guest_of', 'guestOf') || getNoteValue(note, 'Guest of')),
    formatAttendance(get('Attending', 'attending')),
    get('Email', 'email') || contactParts[0] || '',
    formatPhone(get('Phone', 'phone') || contactParts[1] || ''),
    formatYesNo(get('Plus one', 'plus_one', 'plusOneAttendance') || getNoteValue(note, 'Bringing a plus one')),
    get('Plus one name', 'plus_one_name', 'plusOne') || getNoteValue(note, 'Plus one'),
    get('Dietary', 'dietary') || getNoteValue(note, 'Dietary')
  ]
}

function formatRsvpSheet(sheet) {
  const lastRow = Math.max(sheet.getLastRow(), 1)
  const lastColumn = RSVP_HEADERS.length

  sheet.setFrozenRows(1)
  sheet.getRange(1, 1, 1, lastColumn)
    .setFontWeight('bold')
    .setFontColor('#6f3f48')
    .setBackground('#f7d7dc')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')

  sheet.getRange(1, 1, lastRow, lastColumn)
    .setFontFamily('Arial')
    .setFontSize(10)
    .setVerticalAlignment('middle')
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)

  sheet.getRange(2, 1, Math.max(lastRow - 1, 1), 1).setNumberFormat('yyyy/mm/dd hh:mm')
  sheet.getRange(2, 7, Math.max(lastRow - 1, 1), 1).setNumberFormat('@')
  sheet.setColumnWidth(1, 165)
  sheet.setColumnWidth(2, 165)
  sheet.setColumnWidth(3, 165)
  sheet.setColumnWidth(4, 165)
  sheet.setColumnWidth(5, 120)
  sheet.setColumnWidth(6, 220)
  sheet.setColumnWidth(7, 140)
  sheet.setColumnWidth(8, 100)
  sheet.setColumnWidth(9, 170)
  sheet.setColumnWidth(10, 220)
  sheet.setRowHeight(1, 34)

  const dataRange = sheet.getRange(1, 1, lastRow, lastColumn)
  if (!sheet.getFilter()) {
    dataRange.createFilter()
  }

  sheet.getBandings().forEach((banding) => banding.remove())
  dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false)
}

function deleteWishesSheet(spreadsheet) {
  const wishesSheet = spreadsheet.getSheetByName(WISHES_SHEET_NAME)
  if (wishesSheet && spreadsheet.getSheets().length > 1) {
    spreadsheet.deleteSheet(wishesSheet)
  }
}

function headersMatch(actual, expected) {
  return expected.length === actual.length && expected.every((header, index) => actual[index] === header)
}

function getNoteValue(note, label) {
  const line = note.split('\n').find((item) => item.toLowerCase().startsWith(`${label.toLowerCase()}:`))
  if (!line) {
    return ''
  }

  const value = line.slice(line.indexOf(':') + 1).trim()
  return value === '-' ? '' : value
}

function formatSheetDateTime(value) {
  const spreadsheetTimeZone = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone()
  const date = value ? new Date(value) : new Date()

  if (Number.isNaN(date.getTime())) {
    return value || ''
  }

  return Utilities.formatDate(date, spreadsheetTimeZone, 'yyyy/MM/dd HH:mm')
}

function formatPhone(value) {
  const phone = String(value || '').trim()
  if (!phone) {
    return ''
  }

  // The apostrophe tells Google Sheets to keep leading 0 and +84 as text.
  return phone.startsWith("'") ? phone : `'${phone}`
}

function formatAttendance(value) {
  if (value === 'yes') {
    return 'Yes'
  }

  if (value === 'no') {
    return 'No'
  }

  return value || ''
}

function formatGuestOf(value) {
  const guestOf = String(value || '').trim()
  const normalized = guestOf.toLowerCase()

  if (normalized === 'cô dâu & chú rể' || normalized === 'the bride & groom') {
    return 'The Bride & Groom'
  }

  if (normalized === 'nhà cô dâu' || normalized === "the bride's parents") {
    return "The Bride's Parents"
  }

  if (normalized === 'nhà chú rể' || normalized === "the groom's parents") {
    return "The Groom's Parents"
  }

  return guestOf
}

function formatYesNo(value) {
  if (value === 'yes') {
    return 'Yes'
  }

  if (value === 'no') {
    return 'No'
  }

  return value || ''
}

function validatePayload(payload) {
  if (!payload || payload.submissionType !== 'rsvp') {
    throw new Error('Invalid submission type')
  }

  if (!payload.name) {
    throw new Error('Missing name')
  }

  if (!payload.attending) {
    throw new Error('Missing attendance')
  }
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON)
}
```
