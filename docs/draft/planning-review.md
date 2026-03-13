# FaceGuard Planning Review

This document reviews the original proposal and diagrams against the needs of actual implementation.

## 1. Executive Summary

The original planning is directionally strong. The project concept is coherent, and several major choices are still good:

- problem definition
- privacy-preserving goal
- explainability requirement
- React frontend direction
- FastAPI backend direction
- Grad-CAM as the primary explanation method
- Agile delivery model

The main issues are not with the project idea itself. They are with over-specified or contradictory implementation details that would make the MVP harder than necessary.

## 2. What Was Good In The Original Planning

### Keep

- Focus on static profile-photo detection instead of broader multimedia scope.
- Emphasis on explainability rather than black-box prediction only.
- Privacy-by-design as a first-class requirement.
- FastAPI and React as understandable, teachable technologies.
- Starting with a CNN-style model before advanced architectures.
- Clear recognition of fairness and dataset bias concerns.

These are solid foundations and should remain.

## 3. Feasibility Notes By Planned Section

### 3.1 Upload storage in MongoDB

Initial planning problem:

- The architecture diagram stores sanitized images in MongoDB.
- The written proposal says uploads are processed in volatile memory and not stored.

Why this is a problem:

- It directly contradicts the privacy claim.
- It introduces unnecessary infrastructure.
- It creates retention and data-governance questions.

NOTE:

- Persistent upload storage may conflict with privacy/no-retention claims.
- Ephemeral request handling has lower privacy risk.

### 3.2 Netlify as if it were the whole hosting solution

Initial planning problem:

- The proposal states the interface is hosted on Netlify, but the runtime also needs FastAPI model inference.

Why this is a problem:

- A static frontend host does not replace backend API hosting.
- The team could incorrectly assume deployment is solved when only the frontend is hosted.

NOTE:

- Netlify alone does not cover persistent FastAPI inference hosting.
- Separate backend hosting is likely required.

### 3.3 Authentication and login in the requirements

Initial planning problem:

- The RTM and acceptance criteria include login, registration, session expiry, and OAuth-style behavior.

Why this is a problem:

- The core product does not need user identity for the MVP.
- It increases privacy, security, and testing burden.
- It conflicts with the "no storage" direction if history is implied.

NOTE:

- Early authentication adds delivery and security complexity.
- Authentication is more defensible when user-specific history or admin roles are required.

### 3.4 Database-first thinking

Initial planning problem:

- The architecture assumes both database service and cloud storage despite the narrow MVP.

Why this is a problem:

- It creates more moving parts than the team currently needs.
- The main project risk is model correctness and integration, not data persistence.

NOTE:

- Upload database usage increases system complexity early.
- Structured metadata storage is easier to justify once specific features require it.

### 3.5 Training workflow shown as part of the runtime architecture

Initial planning problem:

- Google Colab, model orchestration, model registry, and deployment registry appear tightly coupled to the live system design.

Why this is a problem:

- Training is an offline ML workflow, not a request-path dependency.
- It makes the runtime architecture look more complex than it should be.

NOTE:

- Separating offline training from live inference improves architecture clarity and operability.

### 3.6 Hybrid CNN-ViT as an implied planned destination

Initial planning problem:

- The proposal drifts between ResNet MVP, ViT inference, and hybrid CNN-ViT architecture.

Why this is a problem:

- It weakens technical focus.
- It risks overbuilding before the team proves a baseline.

NOTE:

- Advancing to hybrid CNN-ViT too early can increase technical risk.
- Baseline validation first reduces integration and compute risk.

### 3.7 Hard acceptance targets that may be unrealistic

Initial planning problem:

- Examples include `>= 90% accuracy`, `2-3 seconds`, `<= 5% subgroup variance`, `99% uptime`.

Why this is a problem:

- These numbers may be unachievable or not meaningful without context.
- They can force the team to optimize the wrong thing.

NOTE:

- Hard targets should be treated as planning targets and validated against real constraints.

### 3.8 DVC, Docker, registry, GitHub Actions, and multiple hosted services from day one

Initial planning problem:

- The tooling stack is ambitious before the team has baseline code.

Why this is a problem:

- Every extra tool adds learning cost and integration cost.
- Tooling can consume the time needed for actual model and product work.

NOTE:

- Full tooling from day one can delay core delivery.
- Incremental adoption of tooling generally reduces setup overhead.

### 3.9 "Burner accounts" as a contingency

Initial planning problem:

- The risk register mentions burner accounts for more network limits.

Why this is a problem:

- It is not a professional or supportable mitigation.
- It creates ethical and operational concerns.

NOTE:

- This contingency has ethical and operational risk.
- Approved institutional or documented resource options are safer alternatives.

## 4. What Is Not Wrong, Just Needs Reframing

Some parts of the proposal are not incorrect, but they need to be reframed.

| Original item | Better framing |
| --- | --- |
| Fairness and inclusivity | Treat as evaluation and reporting responsibility first |
| Model registry and reproducibility | Start with simple experiment tracking, then scale tooling if needed |
| Secure upload handling | Keep as file validation, HTTPS, and no-retention behavior |
| Supervisor feedback loops | Keep as sprint reviews, but tie them to working increments |

## 5. Planning Summary With Notes

The original planning remains the reference plan. Feasibility notes are attached section-by-section to highlight risk and delivery tradeoffs without directly replacing the plan.

## 6. Final Judgment

The original planning remains valid as the working plan. The attached notes identify areas with feasibility risk so the team can track and decide during implementation.
