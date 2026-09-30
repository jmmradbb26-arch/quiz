<!-- Sync Impact Report
Version change: none → 1.0.0 (initial constitution)
Modified principles: none; established eight mandatory principles
Added sections: Product Constraints; Verification and Governance
Removed sections: none
Follow-up TODOs: none
-->
# Quiz Computacional Constitution

## Core Principles

### I. Student-Friendly Interface
The interface MUST be simple, clear, and appropriate for students. Labels, instructions,
and actions MUST be understandable without specialist knowledge. This keeps the learning
activity accessible and focused on its educational purpose.

### II. Maintainable Code
Code MUST be organized, readable, and structured for straightforward maintenance. Names,
modules, and responsibilities MUST make the implementation understandable to contributors.

### III. Four Alternatives per Question
Every question MUST have exactly four answer alternatives. Any data or authoring flow that
creates questions MUST preserve this count.

### IV. One Correct Alternative
Every question MUST designate exactly one of its four alternatives as correct. Question
data and answer evaluation MUST enforce this invariant.

### V. Feedback After Every Answer
After each student response, the application MUST provide feedback that communicates the
response outcome. Feedback is part of the learning experience and MUST occur for both
correct and incorrect answers.

### VI. Automatic Scoring
The application MUST calculate the score automatically from the student's answers according
to the quiz's defined scoring rules. The result MUST be reproducible from those answers.

### VII. Simplicity and Dependencies
The project MUST favor the simplest design that meets its educational requirements and
MUST avoid dependencies without a clear need. New dependencies require a concrete
capability that cannot be met reasonably by the existing stack.

### VIII. Objective Verification
Each feature MUST have tests or other objective acceptance criteria that can determine
whether its required behavior is satisfied. Verification criteria MUST be stated clearly
enough to produce a repeatable pass or fail result.

## Product Constraints

The rules for question structure, answer correctness, feedback, and scoring apply to all
quiz content and student answer flows. Product changes MUST preserve these invariants or
amend this constitution before adopting behavior that conflicts with them.

## Development Workflow

Feature specifications MUST define observable acceptance criteria. Implementation and
review MUST check applicable criteria and the eight Core Principles. Prefer focused
changes that are easy to understand and verify. A dependency addition MUST document its
purpose and why the existing stack is insufficient.

## Governance

This constitution governs product and development decisions for Quiz Computacional.
Amendments MUST be made in this document, reviewed for consistency with existing
principles, and recorded with an updated version and amendment date. Versioning follows
Semantic Versioning: MAJOR for incompatible principle or governance changes, MINOR for
new principles or materially expanded requirements, and PATCH for clarifications or
non-semantic edits. Reviews MUST assess compliance with applicable principles and verify
that features meet their objective acceptance criteria. When a principle cannot be met,
the proposal MUST identify the conflict and resolve it through an amendment before
implementation is accepted.

**Version**: 1.0.0 | **Ratified**: 2026-09-29 | **Last Amended**: 2026-09-29
