import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { HomeComponent } from './components/home/home';
import { LibraryComponent } from './components/library/library';
import { MyBooksComponent } from './components/my-books/my-books';
import { authGuard } from './guards/auth.guard'; 
import { adminGuard } from './guards/admin.guard';

// 1. IMPORT YOUR ACTUAL ADMIN COMPONENT
import { AdminComponent } from './components/admin/admin'; 

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  
  // ==========================================
  // REGULAR USER ROUTES
  // ==========================================
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard], 
    children: [
      { path: 'library', component: LibraryComponent, canActivate: [authGuard] },
      { path: 'my-books', component: MyBooksComponent, canActivate: [authGuard] },
      { path: '', redirectTo: 'library', pathMatch: 'full' }
    ]
  },

  // ==========================================
  // ADMIN ROUTES
  // ==========================================
  {
    path: 'admin',
    // 2. ASSIGN THE COMPONENT (No longer commented out!)
    component: AdminComponent, 
    
    // 3. TEMPORARILY disable the guard to prove the component works. 
    // We will uncomment this right after we see the page!
    // canActivate: [adminGuard] 
  }
];