// src/app/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { isLocalStorageAvailable } from './utils/storage.utils';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (!isLocalStorageAvailable()) {
    router.navigate(['/login']);
    return false;
  }

  const token = localStorage.getItem('authToken');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
