import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBookComponent } from '../../admin_component/add-book/add-book';
import { UserManagementComponent } from '../../admin_component/user-management/user-management';
import { InventoryManagementComponent } from '../../admin_component/inventory-management/inventory-management';

// 1. Import your Admin Service
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  // Removed ReactiveFormsModule from imports
  imports: [CommonModule, UserManagementComponent, AddBookComponent, InventoryManagementComponent],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {
  activeTab: string = 'users';
  successMessage: string = '';

  users: any[] = [];
  books: any[] = [];

  // Removed FormBuilder injection
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadBooks();
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.successMessage = '';
  }

  logout(): void {
    this.authService.logout();
  }

  // ==========================================
  // USER MANAGEMENT
  // ==========================================

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data: any) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Failed to load users', err),
    });
  }

  toggleRole(user: any): void {
    const newRole = user.role === 'admin' ? 'user' : 'admin';

    this.adminService.changeUserRole(user.id, newRole).subscribe({
      next: () => {
        user.role = newRole;
        this.showSuccess(`Changed ${user.username}'s role to ${newRole}!`);
      },
      error: (err: any) => {
        console.error('Failed to update role', err);
        alert('Could not update user role. Check console.');
      },
    });
  }

  // Wrapper used by child `app-user-management` output
  onToggleRole(user: any): void {
    this.toggleRole(user);
  }

  // ==========================================
  // BOOK & INVENTORY MANAGEMENT
  // ==========================================

  loadBooks(): void {
    this.adminService.getAllBooks().subscribe({
      next: (response: any) => {
        // .NET Core converts C# PascalCase properties to camelCase in JSON by default.
        // Therefore, 'Data' becomes 'data' in the frontend.
        this.books = response.data;
      },
      error: (err: any) => console.error('Failed to load books', err),
    });
  }

  // Handler for `app-add-book` child component
  // (Removed the redundant onSubmitBook function entirely)
  onBookAdded(book: any): void {
    if (!book) return;
    this.adminService.addBook(book).subscribe({
      next: (newBook: any) => {
        this.showSuccess(`"${book.title}" added to catalog!`);
        this.books.push(newBook);
      },
      error: (err: any) => {
        console.error('Failed to add book', err);
        alert('Could not add the book. Check console.');
      },
    });
  }

  updateCopies(book: any, newAmount: number): void {
    if (newAmount < 0) return;

    this.adminService.updateBookCopies(book.id, newAmount).subscribe({
      next: () => {
        book.copiesAvailable = newAmount;
        this.showSuccess(`Inventory updated for "${book.title}".`);
      },
      error: (err: any) => {
        console.error('Failed to update inventory', err);
        alert('Could not update inventory.');
      },
    });
  }

  // Wrapper for `app-inventory-management` child component
  onUpdateCopies(payload: { book: any; newCount: number }): void {
    if (!payload) return;
    this.updateCopies(payload.book, payload.newCount);
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = ''), 3000);
  }
}
