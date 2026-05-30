// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // Adjust path if necessary

export const authGuard: CanActivateFn = (route, state) => {
  // 1. Inject the services we need
  const authService = inject(AuthService);
  const router = inject(Router);

  // 2. Check if the user has a valid token
  if (authService.isLoggedIn()) {
    return true; // Let them pass!
  } else {
    // 3. If they aren't logged in, kick them back to the login page
    router.navigate(['/login']);
    return false; // Block the navigation
  }
};