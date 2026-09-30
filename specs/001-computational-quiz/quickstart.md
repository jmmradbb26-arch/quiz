# Quickstart and Acceptance Guide

## Prerequisites

- A current desktop or smartphone browser with JavaScript enabled.
- Python 3 available for local static file serving. No package installation, build step, backend service, database, or account is required.

## Start Locally

From the repository root, start a static file server:

```sh
python -m http.server 8000
```

Open `http://localhost:8000/` in the browser. Keep the server running while using the quiz. Do not open `index.html` through a `file://` URL: browser local-file origin restrictions can prevent fetching `data/questions.json`.

If the page reports that the question data could not be loaded, confirm that the local server is still running and that the browser URL begins with `http://localhost:8000/`. If it reports invalid question data, restore the required 10-question structure, four non-empty choices per question, and one matching `correctChoiceId` in `data/questions.json`.

## Acceptance Scenarios

1. **Initial data and layout**: Load the page. The start view appears. Start the quiz and verify question 1 of 10, one statement, four choices, and no question content from later questions.
2. **No selection**: Try to confirm without choosing. No answer is recorded, and the page explains that a choice is required.
3. **Selection and feedback**: Select an answer, change it before confirming, then confirm. The selected alternative is evaluated and correct/incorrect feedback is shown before navigation.
4. **Return and revise**: Answer question 1, advance, return to question 1, select a different answer, and confirm. The new feedback replaces the prior answer's status for scoring; question 1 counts once.
5. **Navigation limits**: Verify forward navigation advances one question at a time and cannot skip an unanswered question; back navigation is available to visited questions. The student cannot restart while the attempt is in progress.
6. **Score calculation**: Complete an attempt with 6 correct and 4 incorrect current answers. Verify 6 correct, 4 incorrect, and 60%. Repeat with all correct and all incorrect to verify 10/0/100% and 0/10/0%.
7. **Completion and restart**: Confirm the tenth answer. Verify the result summary and restart action. Restart and verify question 1, no retained answer, and no retained score.
8. **Responsive desktop and phone**: Check a desktop-sized viewport and a smartphone-sized viewport. All text and controls remain visible and usable without horizontal scrolling; keyboard focus and touch targets remain usable.
9. **Invalid question data**: Temporarily inspect/alter a copy of the JSON to contain a question with three choices or a missing/unknown correct choice ID. Startup must show a clear data error rather than allowing an invalid quiz. Restore the valid data after the check.

Use the exact scenario outcomes above as pass/fail checks. These checks verify behavior without prescribing implementation internals.
