import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth'; 
import { Book } from '../models/book.model'; 

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:5198/api/Books';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getBooks(): Observable<Book[]> {
    const token = this.authService.getToken();
    
    // Attach the JWT to prove the user is logged in
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Book[]>(this.apiUrl, { headers });
  }
}