import { HttpErrorResponse } from '@angular/common/http';

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'Cannot reach the server. Is the API running on port 8080?';
    }

    const body = error.error as ApiError | null;

    if (body?.message) {
      return body.message;
    }
  }

  return fallback;
}
