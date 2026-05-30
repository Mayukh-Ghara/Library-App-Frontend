import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let token = authService.getToken();

  if (token) {
    // THE FIX: Strip out any accidental quotes and spaces!
    token = token.replace(/['"]+/g, '').trim();

    console.log('👉 Interceptor sending request to:', req.url);

    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};