# Implementation Plan: Quiz Computacional

**Branch**: `001-computational-quiz` | **Date**: 2026-09-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification at `specs/001-computational-quiz/spec.md`; planning constraints supplied by the user: browser-based web application using HTML5, CSS3, and plain JavaScript, no frontend framework, questions in local JSON, responsive on desktop and smartphone, and no application backend, database, or authentication.

## Summary

Build a small static quiz website with ten local JSON questions. Semantic HTML/CSS render the interface, JavaScript modules separate quiz state and scoring rules from DOM rendering, and the browser loads question data from a local static origin. The student can confirm answers, receive feedback, navigate among visited questions, revise a previous answer with reconfirmation, view a computed result, and restart after completion.

## Technical Context

**Language/Version**: HTML5, CSS3, and browser-native JavaScript (ES modules; no framework)

**Primary Dependencies**: None; native browser APIs only

**Storage**: `data/questions.json` for the initial question set; attempt state remains in memory and is cleared on restart

**Testing**: Dependency-free manual acceptance scenarios in `quickstart.md`, including desktop and smartphone viewport checks; objective requirement-to-scenario coverage

**Target Platform**: Current desktop and smartphone browsers with JavaScript enabled, accessed over a local or static HTTP(S) origin

**Project Type**: Static frontend web application

**Performance Goals**: Initial question set of 10 questions loads on the first visit; local content and single-screen interactions require no remote service

**Constraints**: Exactly 10 questions initially; exactly four choices and one correct choice per question; no framework, application backend, database, authentication, or persistent attempt history. A separate JSON file cannot be reliably fetched when `index.html` is opened with `file://` in modern browsers; local use therefore requires a static HTTP server such as Python's built-in `http.server`. This serves files only and is not an application backend.

**Scale/Scope**: One student, one in-progress attempt in the current browser tab, 10 fixed questions, one question displayed at a time

## Constitution Check

- **Student-friendly interface**: Pass. Keep wording direct, display one clear question at a time, and use familiar choice controls.
- **Maintainable code**: Pass. Separate presentation, question data, and quiz rules into small named files/modules.
- **Four alternatives per question**: Pass. Validate that every JSON question has exactly four choices before enabling a quiz.
- **One correct alternative**: Pass. Validate that each question identifies exactly one existing choice as correct.
- **Feedback after every answer**: Pass. A confirmed answer displays correct/incorrect feedback before navigation proceeds.
- **Automatic scoring**: Pass. Derive totals from the current confirmed answer for every question, including after a revision.
- **Simplicity and dependencies**: Pass. Use browser-native HTML/CSS/JS and JSON; no packages or application services.
- **Objective verification**: Pass. Map behavior to repeatable acceptance scenarios and scoring examples in the quickstart guide.

## Project Structure

### Documentation (this feature)

```text
specs/001-computational-quiz/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── quiz-ui.md
```

### Source Code (repository root)

```text
index.html
css/
└── styles.css
js/
├── app.js       # Load data and connect UI to quiz logic
├── quiz.js      # Attempt state, answer rules, navigation, and scoring
└── ui.js        # Render views and connect accessible controls/events
data/
└── questions.json
```

**Structure Decision**: Use a single static frontend at repository root. `index.html` provides semantic structure; `css/styles.css` owns visual and responsive rules; `data/questions.json` owns question content; `js/quiz.js` owns domain state transitions and calculations; `js/ui.js` owns rendering and interaction; `js/app.js` loads/validates data and initializes the app. The page is accessed through a local or static HTTP origin so it can load the sibling JSON consistently. No backend directory or test framework is planned.

## Phase 0: Research

Research decisions and primary-source references are recorded in [research.md](research.md). The local JSON constraint is resolved by serving the static files over localhost, not by adding an application backend.

## Phase 1: Design

- The data contract and attempt lifecycle are defined in [data-model.md](data-model.md).
- User-visible interaction states and invariants are defined in [contracts/quiz-ui.md](contracts/quiz-ui.md).
- Local startup and repeatable acceptance checks are defined in [quickstart.md](quickstart.md).

## Constitution Check (Post-Design)

All eight principles remain satisfied. The only operational caveat is that local JSON loading uses a static HTTP origin; the application itself remains client-side and backend-free. No constitution exception or added dependency is required.

## Complexity Tracking

No constitution violations or additional architectural complexity require justification.


