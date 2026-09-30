# Research: Quiz Computacional

## Decision 1: Serve the static application over localhost

- **Decision**: Keep the product as a static browser application. During local use, serve the project directory through a local HTTP static server and fetch `data/questions.json` from that origin. This is not an application backend: it has no API, business logic, database, or authentication.
- **Rationale**: Modern browsers commonly give `file://` documents opaque origins. Fetching a sibling JSON file can therefore fail due to same-origin/CORS restrictions. A local HTTP origin allows HTML, JavaScript, CSS, and JSON to load together reliably.
- **Alternatives considered**:
  - Open `index.html` directly by double-click: rejected because local JSON loading is not reliable across browsers.
  - Embed JSON in the HTML: rejected because the user explicitly wants question data kept in a separate local JSON file.
  - Add an application backend: rejected because the user explicitly excludes one.
- **Sources**: [MDN: CORS request not HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp); [MDN: Set up a local testing server](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/set_up_a_local_testing_server); [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

## Decision 2: Keep the frontend dependency-free and separated by responsibility

- **Decision**: Use semantic HTML for document structure, CSS for presentation, a small vanilla JavaScript module for quiz state/rules, a separate module for DOM rendering and events, and a standalone JSON file for question content.
- **Rationale**: This directly follows the requested technologies and keeps presentation, data, and quiz logic distinct without a framework or package dependency.
- **Alternatives considered**: A frontend framework or a larger multi-layer application structure was rejected as unnecessary for a single-screen, ten-question static quiz.
- **Sources**: [MDN: JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules); [MDN: HTML forms and fieldsets](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset).

## Decision 3: Use native controls and mobile-first responsive CSS

- **Decision**: Present answer choices as native radio controls grouped by `fieldset` and `legend`, with labels and ordinary buttons. Use a fluid single-column layout, viewport metadata, and CSS media queries only where the available width needs a layout adjustment.
- **Rationale**: Native controls provide familiar keyboard and touch behavior. A mobile-first layout supports the target phone and desktop sizes without a UI dependency.
- **Alternatives considered**: Custom interactive controls and device-specific fixed layouts were rejected because they add interaction code and are less flexible.
- **Sources**: [MDN: Responsive design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design); [MDN: Media query fundamentals](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Media_queries); [MDN: `disabled` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/disabled).

## Decision 4: Keep answers in one authoritative client-side attempt state

- **Decision**: Keep the current question index and one current confirmed answer per question in memory. Derive correct, incorrect, and percentage totals from those answers whenever they are confirmed or revised.
- **Rationale**: This naturally supports going back and changing a previously confirmed answer without double counting. It also ensures restart can clear all attempt state without storage or accounts.
- **Alternatives considered**: Increment-only counters were rejected because answer revisions can make them stale. Persistent storage was rejected because cross-session history is out of scope.
- **Source**: Feature requirements FR-008 through FR-011 and the clarification session in `spec.md`.
