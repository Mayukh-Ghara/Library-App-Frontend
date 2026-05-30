import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BookService } from '../../services/book.service';
import { BorrowingService } from '../../services/borrowing.service';
import { Book } from '../../models/book.model'; 

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './library.html',
  styleUrls: ['./library.css']
})
export class LibraryComponent implements OnInit {
  books: Book[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private bookService: BookService,
    private borrowingService: BorrowingService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadBooks();
    }
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.errorMessage = 'Failed to load the library catalog.';
        this.isLoading = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  borrowBook(book: Book): void {
    this.borrowingService.borrowBook(book.id).subscribe({
      next: () => {
        alert(`Success! You have borrowed "${book.title}".`);
        book.copiesAvailable--; // Update UI instantly
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to borrow the book. You might already have it!');
      }
    });
  }
}