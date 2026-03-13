import { API_BASE_URL } from "@/constants";

export async function fetchHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  if (!response.ok) {
    throw new Error("Failed to reach backend health endpoint.");
  }
  return response.json();
}

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    body: formData
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.detail || "Inference failed.");
  }
  return payload;
}

