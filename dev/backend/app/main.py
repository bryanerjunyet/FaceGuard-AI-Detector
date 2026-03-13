from __future__ import annotations

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .core.settings_loader import load_settings
from .schemas import HealthResponse, PredictionResponse
from .services.model_service import model_service_from_settings
from .services.preprocessing import image_to_tensor, strip_exif_and_load_image, validate_upload
from .services.storage_placeholder import StoragePlaceholder


settings = load_settings()
model_service = model_service_from_settings(settings)
storage = StoragePlaceholder(enabled=settings.enable_database)


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="FaceGuard MVP backend for local prototype demonstration.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event() -> None:
    try:
        model_service.ensure_loaded()
    except FileNotFoundError:
        # Allow app startup even when checkpoint is missing.
        return


@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        model_ready=model_service.model_ready,
        model_name=settings.model_name,
    )


@app.post("/api/analyze", response_model=PredictionResponse)
def analyze_image(file: UploadFile = File(...)) -> PredictionResponse:
    try:
        model_service.ensure_loaded()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    raw = validate_upload(
        upload=file,
        allowed_mime_types=settings.allowed_mime_types,
        max_upload_bytes=settings.max_upload_bytes,
    )
    image = strip_exif_and_load_image(raw)
    tensor = image_to_tensor(
        image=image,
        image_size=model_service.image_size,
        device=model_service.device,
        mean=model_service.mean,
        std=model_service.std,
    )

    result = model_service.predict(tensor)
    storage.save_inference_event(
        {
            "label": result.label,
            "confidence": result.confidence,
            "fake_probability": result.fake_probability,
            "model_name": result.model_name,
        }
    )

    return PredictionResponse(
        label=result.label,
        confidence=result.confidence,
        fake_probability=result.fake_probability,
        threshold=result.threshold,
        explanation=result.explanation,
        model_name=result.model_name,
    )


@app.exception_handler(HTTPException)
def http_exception_handler(_, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

