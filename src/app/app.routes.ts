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
import { UserManagementComponent } from './admin_component/user-management/user-management';
import { InventoryManagementComponent } from './admin_component/inventory-management/inventory-management';
import { AddBookComponent } from './admin_component/add-book/add-book';

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
    component: AdminComponent, 
    canActivate: [adminGuard],
    children: [
      {path: 'user-management', component: UserManagementComponent, canActivate: [adminGuard]},
      {path: 'inventory-management', component: InventoryManagementComponent, canActivate: [adminGuard]},
      {path: 'add-book', component: AddBookComponent, canActivate: [adminGuard]},
      {path: '', redirectTo: 'user-management', pathMatch: 'full'}
    ]
  }
];