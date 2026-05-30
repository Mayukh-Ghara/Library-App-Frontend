import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private availableBooks: Book[] = [];

  private myBooks: Book[] = [];

  getAvailableBooks(searchTerm: string = ''): Book[] {
    if (!searchTerm) return this.availableBooks;
    return this.availableBooks.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  getMyBooks(): Book[] {
    return this.myBooks;
  }

  addToMyBooks(book: Book): void {
    if (!this.myBooks.find(b => b.id === book.id)) {
      this.myBooks.push(book);
    }
  }

  removeFromMyBooks(bookId: number): void {
    this.myBooks = this.myBooks.filter(b => b.id !== bookId);
  }
}