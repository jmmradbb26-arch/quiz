# Data Model: Quiz Computacional

## Question Set

A static JSON document contains the initial ten questions.

| Field | Type | Rule |
|---|---|---|
| `questions` | array of Question | Exactly 10 entries for the initial release |

## Question

| Field | Type | Rule |
|---|---|---|
| `id` | string | Required and unique within the question set |
| `prompt` | string | Required, non-empty question statement |
| `choices` | array of Choice | Exactly four choices |
| `correctChoiceId` | string | Must match exactly one choice ID in this question |

## Choice

| Field | Type | Rule |
|---|---|---|
| `id` | string | Required and unique within its question |
| `text` | string | Required, non-empty alternative text |

## Attempt State (in memory)

| Field | Type | Rule |
|---|---|---|
| `status` | enum | `not-started`, `in-progress`, or `completed` |
| `currentQuestionIndex` | integer | Zero-based index in the question set; references one question while in progress |
| `answers` | map keyed by question ID | At most one confirmed current answer per question |

## Confirmed Answer

| Field | Type | Rule |
|---|---|---|
| `questionId` | string | References a question in the loaded set |
| `choiceId` | string | References one of that question's four choices |
| `isCorrect` | boolean | Derived by comparing `choiceId` to `correctChoiceId` |

An unconfirmed selection is transient UI state; it does not affect scoring. When the student revisits an answered question, the current confirmed choice is preselected or otherwise clearly represented. A revised choice replaces the previous answer only when confirmed again. Only one answer per question contributes to totals.

## Result (derived)

- `correctCount`: number of current confirmed answers whose `isCorrect` is true.
- `incorrectCount`: number of current confirmed answers whose `isCorrect` is false.
- `percentage`: `correctCount / 10 * 100`, displayed as an integer percentage.
- The result is shown only after all ten questions have a confirmed current answer and the final answer is confirmed.

## State Transitions

- `not-started` → `in-progress`: student starts the quiz; index is first question and answers are empty.
- `in-progress` → `in-progress`: confirm a selected choice; record/replace the answer, show feedback, and permit movement forward or to a visited earlier question.
- `in-progress` → `completed`: all ten answers are confirmed and the student confirms the last question.
- `completed` → `in-progress`: student chooses restart; clear all answers and start at the first question.

The student cannot restart during an in-progress attempt. Navigation cannot skip unvisited questions. Confirming an answer twice without changing the selected choice must not create duplicate score entries.
