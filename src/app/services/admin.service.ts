import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5198/api';

  constructor(private http: HttpClient) { }

  // --- USER MANAGEMENT ---
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Users`);
  }

  // Add this inside AdminService!
  getAllBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Books`);
  }

  changeUserRole(userId: number, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/Users/${userId}/role`, { role });
  }

  // --- BOOK MANAGEMENT ---
  addBook(bookData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Books`, bookData);
  }

  updateBookCopies(bookId: number, copiesAvailable: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/Books/${bookId}/copies`, { copiesAvailable });
  }
}