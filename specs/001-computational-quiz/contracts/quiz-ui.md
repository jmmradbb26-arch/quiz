# Quiz UI Contract

This contract describes observable browser behavior; it does not prescribe a component framework or backend API.

## Views

1. **Start**: Identify Quiz Computacional and provide a clear action to begin.
2. **Question**: Show progress (question number out of ten), one question statement, four answer choices, a confirm action, and navigation permitted by the attempt state.
3. **Feedback**: After confirmation, visibly identify the response as correct or incorrect and enable navigation. A previously confirmed answer can be revised only by returning to its visited question, selecting a different choice, and confirming again.
4. **Result**: After confirmation of the tenth answer, show correct count, incorrect count, and integer percentage; provide restart.

## Interaction Rules

- Choices are a single-select group. Changing a selected choice before confirmation is allowed.
- Confirm is unavailable or rejected when there is no selected choice; an understandable prompt identifies what the student needs to do.
- Confirmation produces feedback before advancing.
- Forward navigation moves only to the next question and requires feedback on the current question. Back navigation may select an earlier visited question.
- A revised answer replaces that question's prior answer only after reconfirmation; result totals use the current answer once per question.
- Restart appears only on the completed result view. It clears selection, answers, feedback, score, and progress before presenting question one.
- The result uses `correct + incorrect = 10` and `percentage = correct / 10 × 100`.

## Accessibility and Responsive Behavior

- Use semantic headings, a native grouped set of radio choices (`fieldset`/`legend`), associated labels, and native buttons.
- All actions are operable by keyboard; focus remains visible; feedback is perceivable as text and not conveyed by color alone.
- Use a mobile viewport declaration and a fluid layout that fits narrow smartphone widths without horizontal scrolling; keep controls comfortably usable by touch.
- At wider desktop widths, content may use a centered bounded column while preserving the same interaction order.
