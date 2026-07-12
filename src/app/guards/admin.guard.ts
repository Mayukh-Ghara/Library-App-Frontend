import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; 

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get the role from the token
  const role = authService.getUserRole();

  // THE FIX: Use optional chaining (?.) and .toLowerCase() to make it case-insensitive
  if (authService.isLoggedIn() && role?.toLowerCase() === 'admin') {
    return true; 
  } else {
    // If they are just a regular user (or not logged in), kick them out
    router.navigate(['/home/library']);
    return false; 
  }
};