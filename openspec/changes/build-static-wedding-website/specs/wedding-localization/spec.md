## ADDED Requirements

### Requirement: Vietnamese and English locales
The system SHALL support Vietnamese and English localization with Vietnamese as the default locale.

#### Scenario: Default locale
- **WHEN** a guest opens the root route `/`
- **THEN** the site renders Vietnamese content by default

#### Scenario: English locale route
- **WHEN** a guest opens the English locale route
- **THEN** the site renders English content for the same wedding experience

### Requirement: Locale switching
The system SHALL provide a visible, keyboard-accessible control for switching between Vietnamese and English.

#### Scenario: Guest switches language
- **WHEN** a guest activates the locale switcher from Vietnamese to English
- **THEN** the visible content changes to English and the route reflects the English locale

#### Scenario: Guest switches back to Vietnamese
- **WHEN** a guest activates the locale switcher from English to Vietnamese
- **THEN** the visible content changes to Vietnamese and the route returns to the default locale behavior

### Requirement: Locale-owned user-facing text
All user-facing text SHALL be sourced from locale files rather than hardcoded directly in page or component templates.

#### Scenario: Content review
- **WHEN** page and component templates are reviewed
- **THEN** headings, buttons, navigation labels, form labels, validation messages, status messages, alt text, and SEO strings resolve through localization keys

### Requirement: Localized SEO and document language
The system SHALL render locale-appropriate metadata and document language attributes for each generated locale route.

#### Scenario: Vietnamese metadata
- **WHEN** the Vietnamese route is rendered
- **THEN** the document language and SEO metadata describe the Vietnamese version of the wedding page

#### Scenario: English metadata
- **WHEN** the English route is rendered
- **THEN** the document language and SEO metadata describe the English version of the wedding page

### Requirement: Localized static generation
The system SHALL include all supported locale routes in the generated static output.

#### Scenario: Generated locale routes
- **WHEN** `yarn generate` completes
- **THEN** the generated static output includes the default Vietnamese route and the English route
