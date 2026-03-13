# FaceGuard Team Workflow

## 1. Purpose

This document defines how the team should work once implementation begins.

The goal is to reduce friction, avoid undocumented assumptions, and keep the project aligned with its privacy and explainability goals.

## 2. Working Principles

- Keep the MVP narrow.
- Prefer simple architecture over impressive architecture.
- Do not store user uploads unless the team explicitly changes the product scope.
- Keep documentation synchronized with code changes.
- Every major claim about model quality should have evidence.

## 3. Suggested Repository Conventions

### Branching

- `main` should always be in a runnable state.
- Use short-lived feature branches such as `feature/upload-ui`, `feature/baseline-model`, or `fix/api-validation`.
- Merge only after review.

### Commits

Commit messages should describe the actual change clearly.

Examples:

- `add baseline resnet training script`
- `implement upload validation endpoint`
- `render heatmap result card in frontend`

Avoid vague commits such as:

- `update code`
- `fix stuff`

## 4. Issue Tracking

If the team already uses Jira, keep it as the planning tool. If not, GitHub Projects is also acceptable. Do not split planning across too many systems.

Each task should have:

- clear description
- owner
- acceptance condition
- dependency notes if blocked

## 5. Definition Of Ready

A task is ready to start when:

- the expected output is clear
- dependencies are known
- the owner is assigned
- completion criteria are stated

## 6. Definition Of Done

A task is done only when:

- the implementation works
- basic tests or validation have been run
- documentation is updated if behavior changed
- secrets are not committed
- another teammate can understand how to use it

## 7. Review Expectations

Every non-trivial change should be reviewed for:

- correctness
- privacy impact
- failure handling
- unnecessary complexity
- consistency with the documented architecture

Review questions to ask:

1. Does this change move the MVP forward?
2. Does it create hidden storage of user data?
3. Does it make deployment or testing harder than necessary?
4. Is the new abstraction justified?

## 8. Testing Strategy

### Model and data

- validate split generation
- sanity-check preprocessing outputs
- record evaluation metrics for each baseline

### Backend

- request validation tests
- happy-path inference tests
- failure-path tests for invalid uploads
- privacy checks for temporary file cleanup

### Frontend

- upload form behavior
- loading and error states
- result rendering
- disclaimer visibility

### End-to-end

- browser upload to backend response
- local integration smoke test
- deployed demo smoke test

## 9. Documentation Rules

Update docs when any of these change:

- system architecture
- API contract
- dataset choice
- deployment process
- privacy behavior
- user-facing claims

## 10. Security And Privacy Guardrails

- No API keys or secrets in the repository.
- No raw user uploads in git, logs, or screenshots unless explicitly staged as test fixtures.
- Use synthetic or approved sample images for demos and tests.
- If feedback capture is introduced later, require explicit consent and document retention behavior.

## 11. Meeting Cadence

The proposal's Agile cadence is still reasonable if kept lightweight:

- Weekly stand-up
- Sprint planning at the start of each sprint
- Sprint review with supervisor when there is a meaningful increment
- Retrospective focused on blockers and process changes

Do not let meetings replace implementation.

## 12. Decision Logging

When the team makes a meaningful technical decision, record:

- decision
- date
- reason
- impact on scope or architecture

This can be kept in a shared document or in a lightweight `docs/decisions/` folder later.

## 13. Escalation Rules

Raise issues early when:

- dataset access is blocked
- model results are not credible
- deployment plan changes
- privacy assumptions no longer hold
- a feature request conflicts with the MVP
