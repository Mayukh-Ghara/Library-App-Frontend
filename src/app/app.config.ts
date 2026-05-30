import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
// 1. Add withInterceptors to this import
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'; 
import { routes } from './app.routes';

// 2. Import your new auth interceptor
import { authInterceptor } from './services/auth.interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // 3. Register the interceptor alongside your existing fetch config
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) 
    ) 
  ]
};