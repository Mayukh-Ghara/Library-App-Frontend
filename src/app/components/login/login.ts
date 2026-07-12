import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log('Raw Login Response:', response);

        // THE FIX: Look inside response.data first!
        const actualTokenString = response?.data?.token || response?.token;

        // Save ONLY the deeply nested string
        this.authService.saveToken(actualTokenString); 
        
        // Extract the role and navigate
        const role = this.authService.getUserRole();
        
        // THE NEW FIX: Convert to lowercase to catch both 'Admin' and 'admin'
        if (role?.toLowerCase() === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }
}