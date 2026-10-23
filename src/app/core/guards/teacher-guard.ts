import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const teacherGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const session = auth.session();

  if (!session) {
    return router.createUrlTree(['/login']);
  }

  if (session.role !== 'TEACHER') {
    return router.createUrlTree(['/']);
  }

  return true;
};
