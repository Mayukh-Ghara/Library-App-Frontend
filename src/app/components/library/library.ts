import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { BookService } from '../../services/book.service';
import { BorrowingService } from '../../services/borrowing.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './library.html',
  styleUrls: ['./library.css']
})
export class LibraryComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  errorMessage: string = '';
  isLoading: boolean = true;

  // Search
  searchQuery: string = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Pagination (all driven by server response)
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;
  totalCount: number = 0;
  pageNumbers: number[] = [];

  constructor(
    private bookService: BookService,
    private borrowingService: BorrowingService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Debounce search — waits 400ms after user stops typing before calling API
      this.searchSubject.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.currentPage = 1;
        this.loadBooks();
      });

      this.loadBooks();
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getBooks(this.searchQuery, this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        this.books = result.data;
        this.totalCount = result.totalCount;
        this.totalPages = result.totalPages;
        this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load the library catalog.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadBooks();
  }

  borrowBook(book: Book): void {
    this.borrowingService.borrowBook(book.id).subscribe({
      next: () => {
        alert(`Success! You have borrowed "${book.title}".`);
        book.copiesAvailable--;
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to borrow the book. You might already have it!');
      }
    });
  }
}