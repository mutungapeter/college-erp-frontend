// utils/errorHandler.ts

interface ApiErrorData {
  error?: string;
  message?: string;
}

interface ApiError {
  data?: ApiErrorData;
}

/**
 * Extracts a human-readable error message from an RTK Query unwrap() error.
 * Works nicely with toast/alert components in a Next.js + TypeScript app.
 */
export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred.',
): string {
  if (error && typeof error === 'object') {
    const maybeError = error as ApiError;
    const data = maybeError.data;
    if (data?.error) return data.error;
    if (data?.message) return data.message;
  }

  return fallbackMessage;
}
