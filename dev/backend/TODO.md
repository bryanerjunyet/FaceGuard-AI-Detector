# Backend TODO (Post-MVP)

## Database integration

1. Add MongoDB repository layer for:
- upload metadata (filename hash, timestamp, content type)
- inference outcomes (label, confidence, model version)
- explainability artifact references (future Grad-CAM image paths)

2. Move `StoragePlaceholder` to real `StorageService` with:
- retry handling
- schema validation
- async writes

3. Add retention policy:
- automatic deletion windows
- audit logs without storing raw uploaded image bytes

## Security hardening

1. Add auth middleware (JWT or OAuth2).
2. Add rate limiting for analyze endpoint.
3. Add strict file-signature validation (not just mime type).
4. Add malware scan hook for uploaded files.

## Explainability roadmap

1. Add ViT-compatible attention map / Grad-CAM variant.
2. Return heatmap overlay URL from backend.

## MLOps

1. Add model version registry metadata in API response.
2. Add evaluation endpoint to compare model versions.
3. Add startup checksum validation for checkpoint integrity.

