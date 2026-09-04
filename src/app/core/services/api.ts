import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';

@Service()
export class Api {
  private readonly http = inject(HttpClient);

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${API_BASE_URL}${path}`);
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${API_BASE_URL}${path}`, body);
  }

  getBlob(path: string): Observable<Blob> {
    return this.http.get(`${API_BASE_URL}${path}`, { responseType: 'blob' });
  }
}
