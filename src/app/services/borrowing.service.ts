import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BorrowingService {
  private apiUrl = 'http://localhost:5198/api/Borrowings';

  constructor(private http: HttpClient) { }

  getMyBooks(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

  borrowBook(bookId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/borrow`, { bookId: bookId });
  }

  returnBook(bookId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/return`, { bookId: bookId });
  }
}