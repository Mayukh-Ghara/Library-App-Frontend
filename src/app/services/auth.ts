import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5198/api/Auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(credentials: any): Observable<any> {
    this.logout(false);
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  logout(shouldNavigate: boolean = true): void {
    localStorage.removeItem('jwt_token');
    if (shouldNavigate) {
      this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ==========================================
  // JWT DECODING LOGIC
  // ==========================================

  // NEW: A helper method to safely decode Base64Url strings
  private decodeTokenPayload(token: string): any {
    try {
      // 1. Split the token into its parts
      const parts = token.split('.');
      
      // 2. SAFEGUARD: If it doesn't have exactly 3 parts, it's not a real JWT!
      if (parts.length !== 3) {
        console.error('Invalid JWT format detected.');
        return null;
      }

      let base64Url = parts[1];
      
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }

      const decodedJson = atob(base64);
      return JSON.parse(decodedJson);

    } catch (error) {
      console.error('Error securely decoding token', error);
      return null;
    }
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodeTokenPayload(token);
    if (!payload) return null;

    const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    return payload[roleKey] || payload.role || null;
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    
    const payload = this.decodeTokenPayload(token);
    if (!payload) return null;

    // Check your console to see exactly what C# named your ID key!
    console.log('My JWT Payload contains:', payload); 

    const idKey = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
    const idString = payload[idKey] || payload.nameid || payload.id || null;
      
    return idString ? parseInt(idString, 10) : null;
  }

  
}