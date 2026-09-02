import { computed, inject, Service, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Branch } from '../../auth/models/branch';
import { LoginRequest } from '../../auth/models/login-request';
import { LoginResponse } from '../../auth/models/login-response';
import { RegisterRequest } from '../../auth/models/register-request';
import { RegisterResponse } from '../../auth/models/register-response';
import { Session } from '../../auth/models/session';
import { Api } from './api';

const SESSION_KEY = 'pythogorean.session';

@Service()
export class Auth {
  private readonly api = inject(Api);

  private readonly currentSession = signal<Session | null>(readStoredSession());

  readonly session = this.currentSession.asReadonly();
  readonly isLoggedIn = computed(() => this.currentSession() !== null);

  token(): string | null {
    return this.currentSession()?.token ?? null;
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/auth/login', request).pipe(
      tap((response) => this.startSession(response)),
    );
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.api.post<RegisterResponse>('/auth/register', request);
  }

  getBranches(): Observable<Branch[]> {
    return this.api.get<Branch[]>('/branches');
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this.currentSession.set(null);
  }

  private startSession(response: LoginResponse): void {
    const session: Session = {
      token: response.token,
      name: response.name,
      email: response.email,
      role: response.role,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.currentSession.set(session);
  }
}

function readStoredSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}
