# FaceGuard MVP Prototype

This repository contains the current FaceGuard MVP detector application:

- `dev/frontend`: React + Vite web UI
- `dev/backend`: FastAPI inference API
- `config/settings.py`: centralized app settings
- `models/pretrained/`: deployed `.pth` checkpoints used by the backend

## 1. MVP scope

Included:

- image upload and preview UI
- local backend inference API
- checkpoint loading from `models/pretrained/`
- REAL/FAKE result + confidence
- no database persistence (privacy-first in-memory processing)

Not included yet:

- authentication backend
- database integration
- Grad-CAM visual explainability image

## 2. Prerequisites

1. Python 3.9+
2. Node.js 18+
3. A valid checkpoint file at:
   - `models/pretrained/vit.pth`

## 3. Backend setup

### Option A: Using a Virtual Environment (Recommended)

From repository root:

```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r dev/requirements.txt
```

Run backend:

```bash
cd dev/backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Option B: System-wide Installation

If you encounter permission errors on Windows, use the `--user` flag:

```bash
pip install -r dev/requirements.txt --user
```

Run backend:

```bash
cd dev/backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Health Check

Open in browser or use curl:

```bash
http://127.0.0.1:8000/api/health
```

If `vit.pth` is missing, health still works but analysis endpoint returns a clear `503` error with instructions.

## 4. Frontend setup

From repository root:

```bash
cd dev/frontend
npm install
```

Optional env override:

```bash
copy .env.example .env
```

Run frontend:

```bash
npm run dev
```

Open:

- `http://localhost:5173`

## 5. API contract

### `GET /api/health`

Response:

```json
{
  "status": "ok",
  "model_ready": true,
  "model_name": "vit"
}
```

### `POST /api/analyze`

Form data:

- `file`: image file (`jpeg/png/webp`)

Response:

```json
{
  "label": "FAKE",
  "confidence": 0.9123,
  "fake_probability": 0.9123,
  "threshold": 0.5,
  "explanation": "Prediction is based on a ViT deepfake classifier...",
  "model_name": "vit"
}
```

## 6. Design note

The frontend follows the FaceGuard page flow from the planning and design materials in `docs/`:

- Home
- Start Guide
- Sign In (prototype placeholder)
- Upload and Analyze

Reference design images are available under `docs/design/`.

## 7. Database integration TODO

See:

- `dev/backend/TODO.md`

This includes the next integration tasks for MongoDB and production-hardening.

## 8. Third-party notices

Model and dataset provenance notes for this repository are documented in:

- `models/THIRD_PARTY_NOTICES.md`
