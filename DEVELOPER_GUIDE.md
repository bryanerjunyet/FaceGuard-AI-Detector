# FaceGuard MVP — Developer Guide

## Why are there two localhost addresses?

When you run FaceGuard locally you start **two separate server processes**:

| Process | What it does | Default address |
|---|---|---|
| **Backend** (`FastAPI`) | Runs the AI model and processes image uploads | `http://127.0.0.1:8000` |
| **Frontend** (`Vite / React`) | Serves the web pages you see in your browser | `http://localhost:5173` |

They need different ports because they are two different programs running at the same time.  
**You always open `http://localhost:5173` in your browser.** The frontend talks to the backend
automatically at port 8000 — you never need to open port 8000 in the browser yourself.

> **Why did I sometimes see port 5174?**  
> Vite auto-increments the port when 5173 is already in use by a previous session you forgot to
> close. This breaks the app because the backend only allows requests from port 5173 (CORS
> security). The port is now pinned to 5173 with `strictPort: true` — Vite will show an error
> and refuse to start instead of silently switching ports. If you see that error, close the
> other terminal that is already using 5173 and try again.

---

## Project layout

```
FaceGuard-AI-Detector/
├── config/
│   └── settings.py
├── dev/
│   ├── backend/
│   └── frontend/
├── docs/
│   └── design/
└── models/
  ├── pretrained/
  │   ├── vit.pth
  │   ├── xception.pth
  │   └── pg_fdd.pth
  ├── README.md
  └── THIRD_PARTY_NOTICES.md
```

---

## Prerequisites

- Python 3.9 or newer
- Node.js 18 or newer
- `training/pretrained/vit.pth` checkpoint file (obtain separately)

---

## First-time setup (run once)

### 1. Install Python dependencies

Open a terminal in the **repository root** and run:

```powershell
# Windows — install packages for the current user (no admin rights needed)
pip install -r requirements.txt --user
```

You only need to do this once. If you add a new package to `requirements.txt` later,
run this command again.

### 2. Install Node.js dependencies

```powershell
cd dev/frontend
npm install
```

You only need to do this once. If `package.json` changes (someone adds a new library),
run `npm install` again from `dev/frontend`.

---

## Starting the app (do this every time)

You need **two terminals open at the same time**. Keep both running while you work.

### Terminal 1 — Start the backend

```powershell
cd dev/backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

Verify it works — open this URL in your browser (or paste in terminal with curl):
```
http://127.0.0.1:8000/api/health
```
Expected response:
```json
{
  "status": "ok",
  "model_ready": true,
  "model_name": "vit"
}
```

### Terminal 2 — Start the frontend

```powershell
cd dev/frontend
npm run dev
```

You should see:
```
  VITE v5.x  ready in ... ms
  ➜  Local:   http://localhost:5173/
```

**Open `http://localhost:5173` in your browser.** That is your website.

---

## What to restart after each type of change

| What you changed | What to restart |
|---|---|
| Any Python file in `dev/backend/` | Nothing — `--reload` auto-restarts the backend |
| `config/settings.py` | Stop and restart **Terminal 1** (backend) |
| Any file in `dev/frontend/src/` | Nothing — Vite hot-reloads the browser automatically |
| `dev/frontend/package.json` (added npm package) | Stop and restart **Terminal 2**, run `npm install` first |
| `requirements.txt` (added Python package) | Run `pip install -r requirements.txt --user`, then restart **Terminal 1** |

---

## Switching the AI model

Open `config/settings.py`. There are three model blocks — only ONE should be
uncommented at a time. Comment out the active block and uncomment the one you
want:

```python
# ViT-B/16 (currently active):
model_name: str = "vit"
model_path: Path = REPO_ROOT / "models" / "pretrained" / "vit.pth"
#
# Xception:
# model_name: str = "xception"
# model_path: Path = REPO_ROOT / "models" / "pretrained" / "xception.pth"
#
# PG-FDD (Fair Deepfake Detector):
# model_name: str = "pg_fdd"
# model_path: Path = REPO_ROOT / "models" / "pretrained" / "pg_fdd.pth"
```

You only need to change `model_name` and `model_path` — the image size and
normalization are handled automatically by the model registry in the backend.

| Model | Checkpoint file | Input size | Description |
|---|---|---|---|
| ViT-B/16 | `vit.pth` | 224×224 | Vision Transformer binary classifier |
| Xception | `xception.pth` | 256×256 | Xception binary classifier |
| PG-FDD | `pg_fdd.pth` | 256×256 | Fair Deepfake Detector (3× Xception) |

After saving `settings.py`:

1. Press **Ctrl+C** in the backend terminal.
2. Clear bytecache: `Get-ChildItem -Path . -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force`
3. Restart the backend: `python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000`
4. Verify at `http://127.0.0.1:8000/api/health` — check that `model_name` matches.

The frontend does not need to restart.

### Adding a new model in the future

1. Place the `.pth` checkpoint in `models/trained`.
2. Define its `nn.Module` class in `dev/backend/app/services/architectures.py`.
3. Add a build function and output extractor in `dev/backend/app/services/model_service.py`.
4. Add one entry to `MODEL_REGISTRY` in `model_service.py`.
5. Add a comment block in `config/settings.py` for easy switching.

---

## Troubleshooting

### Stale Python processes (most common issue)

**Symptoms:**
- You changed `config/settings.py` (e.g. switched model) but the health
  endpoint still returns the old `model_name`.
- "Address already in use" error when starting the backend.
- The website shows results from a model you are no longer using.

**Why it happens:**
Every time you run `python -m uvicorn ...`, a Python process starts and stays
running **even after you close the VS Code terminal tab**. If you don't press
**Ctrl+C** first, the old process keeps serving on port 8000 with old settings
baked into memory. Closing a terminal tab does NOT kill the process.

**How to fix (step by step):**

```powershell
# 1. See all running Python processes (look for old StartTime values)
Get-Process -Name python -ErrorAction SilentlyContinue |
    Select-Object Id, Path, StartTime | Format-Table -AutoSize

# 2. Kill ALL Python processes
Get-Process -Name python -ErrorAction SilentlyContinue | Stop-Process -Force

# 3. Wait for ports to fully release
Start-Sleep 3

# 4. Clear all compiled bytecache (prevents stale .pyc files)
Get-ChildItem -Path . -Recurse -Directory -Filter "__pycache__" |
    Remove-Item -Recurse -Force

# 5. Restart the backend
cd dev/backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# 6. Verify — open in browser or run:
# http://127.0.0.1:8000/api/health
# Confirm model_name matches what you set in config/settings.py
```

**Prevention:** Always press **Ctrl+C** in the backend terminal before
closing it or starting a new server.

---

### Changes to `config/settings.py` not taking effect

**Why:** The `--reload` flag only watches files inside `dev/backend/`. The
`config/` directory is outside that folder, so the backend does **not**
auto-restart when you edit `settings.py`.

Additionally, Python caches compiled bytecode (`.pyc`) in `__pycache__`
folders. Even after restarting the server, Python may load the old `.pyc`
instead of re-reading the `.py` source file.

**How to fix:**

1. Press **Ctrl+C** in the backend terminal.
2. Clear bytecache:
   ```powershell
   Get-ChildItem -Path . -Recurse -Directory -Filter "__pycache__" |
       Remove-Item -Recurse -Force
   ```
3. Restart the backend:
   ```powershell
   cd dev/backend
   python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

---

### "Address already in use" on port 8000

Another process is still using port 8000. Find and kill it:

```powershell
$p = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue |
     Select-Object -First 1 -ExpandProperty OwningProcess
if ($p) { Stop-Process -Id $p -Force; Write-Output "Killed PID $p" }
else { Write-Output "Port is free" }
```

Wait 2–3 seconds, then start the backend again.

---

### "Port 5173 is already in use" (Vite error)

A previous frontend session is still running. Close that terminal or kill the
process:

```powershell
$p = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue |
     Select-Object -First 1 -ExpandProperty OwningProcess
if ($p) { Stop-Process -Id $p -Force; Write-Output "Killed PID $p" }
else { Write-Output "Port is free" }
```

Then run `npm run dev` again.

---

### "Failed to fetch" or CORS error in browser

**Checklist:**

1. **Is the backend running?** Check Terminal 1. If it crashed, restart it.
2. **Is Vite on port 5173?** The terminal running `npm run dev` must show
   `http://localhost:5173/`, not 5174 or anything else.
3. **Is port 8000 responding?** Open `http://127.0.0.1:8000/api/health` in
   the browser. If it doesn't load, the backend is down — see sections above.

---

### `model_ready: false` in health check

The checkpoint file is missing. Make sure the correct `.pth` file exists:

| Model | Expected path |
|---|---|
| ViT | `models/pretrained/vit.pth` |
| Xception | `models/pretrained/xception.pth` |

The backend will start without the checkpoint, but the `/api/analyze` endpoint
will return a `503` error telling you which file is missing.

---

### Nuclear option — full clean restart

If nothing else works, run this entire sequence:

```powershell
# Kill everything
Get-Process -Name python -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep 3

# Clear all bytecache
Get-ChildItem -Path . -Recurse -Directory -Filter "__pycache__" |
    Remove-Item -Recurse -Force

# Terminal 1 — start backend
cd dev/backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2 (open a new terminal) — start frontend
cd dev/frontend
npm run dev
```

Then open `http://localhost:5173` in the browser.

---

## API reference

### `GET /api/health`

```json
{
  "status": "ok",
  "model_ready": true,
  "model_name": "vit"
}
```

### `POST /api/analyze`

Upload an image as `multipart/form-data` with field name `file` (JPEG, PNG, or WebP, max 10 MB).

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
- Upload and Analyze

If you add exact design assets later, this frontend can be restyled quickly without backend changes.

## 7. Database integration TODO

See:

- `dev/backend/TODO.md`

This includes the next integration tasks for MongoDB and production-hardening.

