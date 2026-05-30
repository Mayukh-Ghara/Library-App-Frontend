import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // 1. Import isPlatformBrowser
import { BorrowingService } from '../../services/borrowing.service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-books.html',
  styleUrls: ['./my-books.css']
})
export class MyBooksComponent implements OnInit {
  borrowedBooks: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private borrowingService: BorrowingService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object // 2. Inject PLATFORM_ID
  ) {}

  ngOnInit(): void {
    // 3. ONLY run this in the browser where your JWT token actually exists!
    if (isPlatformBrowser(this.platformId)) {
      this.loadMyBooks();
    } else {
      // If running on the server, just wait silently.
      this.isLoading = false; 
    }
  }

  loadMyBooks(): void {
    const userId = this.authService.getUserId();

    if (!userId) {
      this.errorMessage = 'Could not securely identify your account.';
      this.isLoading = false;
      return;
    }

    this.borrowingService.getMyBooks(userId).subscribe({
      next: (data) => {
        this.borrowedBooks = data; 
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching my books', err);
        this.errorMessage = 'Could not load your borrowed books.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  returnBook(bookId: number, title: string): void {
    this.borrowingService.returnBook(bookId).subscribe({
      next: () => {
        alert(`You have successfully returned "${title}".`);
        // Remove from the local array to update the UI instantly
        this.borrowedBooks = this.borrowedBooks.filter(b => b.bookId !== bookId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Failed to return the book. Please try again.');
      }
    });
  }
}