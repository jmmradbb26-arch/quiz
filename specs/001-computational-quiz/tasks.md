---
description: "Dependency-ordered implementation tasks for Quiz Computacional"
---

# Tasks: Quiz Computacional

**Input**: Design documents from `specs/001-computational-quiz/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/quiz-ui.md`, and `quickstart.md`

**Tests**: No automated test tasks are included because they were not explicitly requested. The objective, repeatable acceptance scenarios in `quickstart.md` remain the implementation criteria.

**Organization**: Tasks are grouped by user story. Static data loading and shared attempt state are foundational; user-facing work follows story priority.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files can be changed independently after stated dependencies are complete.
- **[Story]**: User story mapping from `spec.md` (US1, US2, US3).
- Descriptions include concrete file paths and constraints from the data model.

## Phase 1: Setup

**Purpose**: Establish the static frontend file structure without adding packages or build tooling.

- [X] T001 Create the static app files and directories `index.html`, `css/styles.css`, `js/app.js`, `js/quiz.js`, `js/ui.js`, and `data/questions.json` according to `specs/001-computational-quiz/plan.md`.

---

## Phase 2: Foundational

**Purpose**: Supply valid question data, shared quiz state, and startup/data-error handling required by all user stories.

- [X] T002 [P] Populate `data/questions.json` with exactly 10 basic-computing questions; every question must have a required unique `id`, a required non-empty `prompt`, exactly four `choices`, a required unique `id` and non-empty `text` for each choice, and a `correctChoiceId` matching exactly one choice ID.
- [X] T003 [P] Implement the shared attempt state and state transitions in `js/quiz.js` with `not-started`, `in-progress`, and `completed` states, a zero-based current question index, and at most one confirmed answer per question ID.
- [X] T004 Load `data/questions.json`, validate all question and choice constraints before starting, and show an understandable data-loading or invalid-data error from `js/app.js` when loading or validation fails.

**Checkpoint**: The app can load and validate its 10-question data set on a local HTTP origin, and shared attempt state is available before story implementation.

---

## Phase 3: User Story 1 - Responder ao quiz (Priority: P1) 🎯 MVP

**Goal**: Let the student answer one question at a time, receive feedback, and navigate among visited questions.

**Independent Test**: Start a valid quiz; verify one question and four choices at a time; confirm an answer and see correct/incorrect feedback; change a choice before confirmation; visit a previous question, change its confirmed answer and reconfirm; verify forward navigation cannot skip an unanswered question.

- [X] T005 [US1] Render the start view and current question, progress indicator, four labeled choices, and permitted navigation controls in `js/ui.js` using the structure in `index.html`.
- [X] T006 [US1] Implement choice selection and confirmation in `js/ui.js` and `js/quiz.js`; allow changing an unconfirmed selection, reject confirmation without a selection, and show feedback after confirmation.
- [X] T007 [US1] Implement next-question and visited-question back navigation plus reconfirmation of revised answers in `js/quiz.js` and `js/ui.js`; keep only the latest confirmed answer for each question.
- [X] T008 Style the quiz in `css/styles.css` as a mobile-first fluid layout with readable question/choice content, visible keyboard focus, and usable controls on smartphone and desktop widths.

**Checkpoint**: The student can complete the question-answer-feedback flow, revise a visited response, and navigate without skipping unanswered questions.

---

## Phase 4: User Story 2 - Consultar resultado (Priority: P2)

**Goal**: Calculate and present correct answers, incorrect answers, and the percentage after the tenth answer.

**Independent Test**: Complete attempts with 6, 10, and 0 correct current answers; verify respectively 6/4/60%, 10/0/100%, and 0/10/0%; revise an answer before completion and verify the latest confirmed answer is counted once.

- [X] T009 [US2] Derive the result in `js/quiz.js` from current confirmed answers using `incorrectCount = 10 - correctCount` and `percentage = correctCount / 10 * 100`, recalculating after a revised answer is confirmed.
- [X] T010 [US2] Render the completed result view in `js/ui.js` after all ten questions have confirmed answers, showing correct count, incorrect count, and integer percentage.

**Checkpoint**: A completed attempt reports reproducible totals and handles all-correct, all-incorrect, and revised-answer cases.

---

## Phase 5: User Story 3 - Reiniciar o quiz (Priority: P3)

**Goal**: Allow a new attempt only after the completed result is shown, clearing all state from the previous attempt.

**Independent Test**: Finish the quiz, restart from the result view, and verify the first question is shown with no previous selections, feedback, answers, or score; verify no restart action is available during an active attempt.

- [X] T011 [US3] Implement completed-only restart in `js/quiz.js`, returning to question one and clearing confirmed answers, transient selection, feedback, completion status, and derived totals.
- [X] T012 [P] Add the restart action to the completed result view in `js/ui.js`; do not render or enable it during an in-progress attempt.

**Checkpoint**: Restart is available only after completion and begins a clean attempt at the first question.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete the browser-first experience and verify the documented operating constraints.

- [X] T013 Review semantic labels, feedback announcements, keyboard operation, focus visibility, and touch usability in `index.html`, `js/ui.js`, and `css/styles.css` against `specs/001-computational-quiz/contracts/quiz-ui.md`.
- [X] T014 Update `specs/001-computational-quiz/quickstart.md` with any implementation-specific launch, error, or acceptance details while retaining the static localhost server requirement for loading `data/questions.json`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; create the planned file layout first.
- **Foundational (Phase 2)**: Depends on T001. T002 and T003 can proceed in parallel; T004 depends on valid JSON from T002.
- **User Story 1 (Phase 3)**: Depends on T002, T003, and T004. T008 depends on T005 to establish the markup and class names; after T005, it can proceed in parallel with T006-T007 because it is isolated to `css/styles.css`.
- **User Story 2 (Phase 4)**: Depends on US1 because the current confirmed-answer map and completion flow are created there.
- **User Story 3 (Phase 5)**: Depends on US2 because restart is exposed only from the completed result view.
- **Polish (Phase 6)**: Depends on all three user stories.

### User Story Dependencies

- **US1 (P1)**: Starts after the foundational data loader and shared attempt state; it is the MVP increment.
- **US2 (P2)**: Depends on US1's question and confirmed-answer flow to produce a completed attempt.
- **US3 (P3)**: Depends on US2's completed result screen, where restart is available.

### Parallel Opportunities

- After T001, T002 (question data) and T003 (attempt state) can be implemented in parallel because they are separate files.
- In US1, after T005 establishes markup and class names, T008 (responsive CSS) can proceed in parallel with T006-T007.
- In US3, T011 (state reset in `js/quiz.js`) and T012 (restart control in `js/ui.js`) can proceed in parallel once the restart behavior contract is agreed; integrate them before the checkpoint.
- No story phases are independent in this feature because result and restart depend on the preceding answer flow.

### Parallel Example: Foundation

```text
T002 Populate data/questions.json with the validated ten-question set.
T003 Implement shared attempt state in js/quiz.js.
```

### Parallel Example: User Story 1

```text
T005 Render the question interaction in js/ui.js.
T008 Build responsive presentation rules in css/styles.css.
```

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Setup and Foundational phases.
2. Complete US1 and verify its independent acceptance criteria.
3. Add US2 result calculation and result presentation.
4. Add US3 completed-only restart.
5. Complete the cross-cutting accessibility, responsive, and quickstart review.

### Incremental Delivery

1. Deliver question selection, confirmation, feedback, and navigation.
2. Add calculated completion results.
3. Add restart from the completed result.
4. Review the full app against `quickstart.md` and the UI contract.

## Notes

- `[P]` indicates tasks that touch different files and have no unmet dependency.
- Each user story has an independent acceptance criterion in its phase header.
- The app has no package manifest, build step, frontend framework, application backend, database, or authentication.
- Run the app through a local/static HTTP origin as described in `specs/001-computational-quiz/quickstart.md`; direct `file://` loading is not the supported path for fetching the local JSON file.

