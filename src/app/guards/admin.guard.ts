import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.getUserRole();

  if (authService.isLoggedIn() && role?.toLowerCase() === 'admin') {
    return true;
  } else {
    router.navigate(['/home/library']);
    return false;
  }
};