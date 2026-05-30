import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; 

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if they are logged in AND have the 'admin' role
  if (authService.isLoggedIn() && authService.getUserRole() === 'admin') {
    return true; 
  } else {
    // If they are just a regular user (or not logged in), kick them out
    router.navigate(['/home/library']);
    return false; 
  }
};