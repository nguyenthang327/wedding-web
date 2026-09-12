## ADDED Requirements

### Requirement: Configurable static-safe submission endpoint
The system SHALL submit guest forms to a runtime-configured public HTTPS endpoint that is compatible with a Google Apps Script Web App or equivalent relay.

#### Scenario: Endpoint configured
- **WHEN** a submission endpoint is configured
- **THEN** wish and RSVP forms submit their payloads to that endpoint from the browser

#### Scenario: Endpoint missing
- **WHEN** no submission endpoint is configured
- **THEN** submitting a form does not crash and shows a localized configuration error

### Requirement: No client-side credentials
The system MUST NOT expose Google service account keys, OAuth client secrets, private tokens, or other write credentials in client-accessible code or generated static output.

#### Scenario: Client bundle review
- **WHEN** the generated static output and public runtime config are reviewed
- **THEN** only the public submission endpoint URL is present and no private Google credential material is included

### Requirement: Wish form
The system SHALL provide a guest-facing wish form that validates input and submits wish data.

#### Scenario: Wish validation failure
- **WHEN** a guest submits the wish form with missing or invalid required fields
- **THEN** the form shows localized inline validation errors and does not send the invalid payload

#### Scenario: Wish submission success
- **WHEN** a guest submits a valid wish and the endpoint accepts it
- **THEN** the form shows a localized success state and sends a payload containing submission type, submission id, locale, timestamp, page URL, guest name, and message

#### Scenario: Wish submission failure
- **WHEN** a valid wish submission fails due to network, endpoint, or response error
- **THEN** the form shows a localized error state and preserves the guest's entered values

### Requirement: RSVP form
The system SHALL provide a guest-facing RSVP form that validates attendance details and submits RSVP data.

#### Scenario: RSVP validation failure
- **WHEN** a guest submits the RSVP form with missing or invalid required fields
- **THEN** the form shows localized inline validation errors and does not send the invalid payload

#### Scenario: RSVP submission success
- **WHEN** a guest submits a valid RSVP and the endpoint accepts it
- **THEN** the form shows a localized success state and sends a payload containing submission type, submission id, locale, timestamp, page URL, guest name, attendance choice, guest count, contact, and note

#### Scenario: RSVP submission failure
- **WHEN** a valid RSVP submission fails due to network, endpoint, or response error
- **THEN** the form shows a localized error state and preserves the guest's entered values

### Requirement: Submission feedback states
The system SHALL provide clear loading, success, and error states for each form submission.

#### Scenario: Loading state
- **WHEN** a form submission is in progress
- **THEN** the submit button communicates loading state and prevents accidental duplicate submissions

#### Scenario: Independent form states
- **WHEN** one form is submitting or has an error
- **THEN** the other form remains usable and does not inherit the wrong status

### Requirement: Google Sheets data contract
The system SHALL document the expected Google Sheets tabs and columns for wishes and RSVPs.

#### Scenario: Documentation review
- **WHEN** integration documentation is reviewed
- **THEN** it lists the expected `wishes` and `rsvps` tabs, required columns, runtime config variable, and endpoint behavior

### Requirement: Basic spam resistance
The system SHALL include lightweight client payload fields that allow the endpoint to reject obvious automated spam.

#### Scenario: Anti-spam metadata included
- **WHEN** a valid form is submitted
- **THEN** the payload includes a honeypot value and elapsed-time metadata that the endpoint can validate
