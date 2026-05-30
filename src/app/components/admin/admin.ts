import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// 1. Import your Admin Service!
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'] 
})
export class AdminComponent implements OnInit {
  activeTab: string = 'users'; 
  successMessage: string = '';
  
  users: any[] = [];
  books: any[] = [];
  bookForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService, // 2. Inject the service here
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: ['', Validators.required],
      publishedYear: ['', Validators.required],
      copiesAvailable: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // 3. Automatically load data from C# when the page opens!
      this.loadUsers();
      this.loadBooks(); 
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.successMessage = ''; 
  }

  // ==========================================
  // USER MANAGEMENT
  // ==========================================

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      // Added : any to data and err
      next: (data: any) => this.users = data,
      error: (err: any) => console.error('Failed to load users', err)
    });
  }

  toggleRole(user: any): void {
    const newRole = user.role === 'admin' ? 'user' : 'admin';

    this.adminService.changeUserRole(user.id, newRole).subscribe({
      next: () => {
        user.role = newRole; 
        this.showSuccess(`Changed ${user.username}'s role to ${newRole}!`);
      },
      // Added : any to err
      error: (err: any) => {
        console.error('Failed to update role', err);
        alert('Could not update user role. Check console.');
      }
    });
  }

  // ==========================================
  // BOOK & INVENTORY MANAGEMENT
  // ==========================================

  loadBooks(): void {
    this.adminService.getAllBooks().subscribe({
      // Added : any to data and err
      next: (data: any) => this.books = data,
      error: (err: any) => console.error('Failed to load books', err)
    });
  }

  onSubmitBook(): void {
    if (this.bookForm.invalid) return;

    this.adminService.addBook(this.bookForm.value).subscribe({
      // Added : any to newBook and err
      next: (newBook: any) => {
        this.showSuccess(`"${this.bookForm.value.title}" added to catalog!`);
        this.books.push(newBook); 
        this.bookForm.reset({ copiesAvailable: 1 }); 
      },
      error: (err: any) => {
        console.error('Failed to add book', err);
        alert('Could not add the book. Check console.');
      }
    });
  }

  updateCopies(book: any, newAmount: number): void {
    if (newAmount < 0) return; 

    this.adminService.updateBookCopies(book.id, newAmount).subscribe({
      next: () => {
        book.copiesAvailable = newAmount; 
        this.showSuccess(`Inventory updated for "${book.title}".`);
      },
      // Added : any to err
      error: (err: any) => {
        console.error('Failed to update inventory', err);
        alert('Could not update inventory.');
      }
    });
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000);
  }
}
