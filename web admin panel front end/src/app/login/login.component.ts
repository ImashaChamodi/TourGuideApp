import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

interface LoginResponse {
  token: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login(): void {
    // Send login request to server
    this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email: this.email,
      password: this.password
    }).subscribe(
      response => {
        console.log('Login successful');
        // Save token to local storage
        localStorage.setItem('token', response.token);
        // Show a success message using MatSnackBar
        this.snackBar.open('Login successful', 'Close', { duration: 3000 });
        // Navigate to check component
        this.router.navigate(['/check']);
      },
      error => {
        console.log('Login failed');
        this.errorMessage = 'Invalid email or  assword';
      }
    );
  }
}
