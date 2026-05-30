import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['']
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const userData = this.signupForm.value;

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Registration successful!');
          this.router.navigate(['/login']); 
        },
        error: (err) => {
          console.error('Registration failed', err);
          this.errorMessage = 'An error occurred during registration. Please try again.';
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}