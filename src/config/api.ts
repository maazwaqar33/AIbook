/*
  API Configuration for Physical AI Textbook
  
  This file centralizes the backend API URL configuration.
  
  DEPLOYMENT SETUP:
  1. Frontend (Docusaurus) → Vercel
  2. Backend (FastAPI) → Hugging Face Spaces
  
  After deploying your backend to Hugging Face, update the HF_BACKEND_URL below.
*/

// =============================================
// HUGGING FACE BACKEND URL (LIVE!)
// =============================================
const HF_BACKEND_URL = 'https://maazahmedsiddiqui-physical-ai-api.hf.space';

/**
 * Get the API URL based on environment
 */
export function getApiUrl(): string {
    if (typeof window === 'undefined') return '';

    const hostname = window.location.hostname;

    // Local development - use local backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000';
    }

    // Production - use Hugging Face backend
    return HF_BACKEND_URL;
}

/**
 * Check if backend is available (always true now since we have HF backend)
 */
export function isBackendAvailable(): boolean {
    return true;
}

export const API_URL = getApiUrl();
