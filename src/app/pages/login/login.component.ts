// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoginDto, AuthResponseDTO } from '../../models/auth-response.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private apiService: ApiService) {}

  onSubmit(): void {
    const loginDto: LoginDto = { username: this.username, password: this.password };
    this.apiService.loginAsAdmin(loginDto).subscribe({
      next: (response: AuthResponseDTO) => {
        this.router.navigate(['/admin/blog']);
      },
      error: () => {
        alert('Credenciales incorrectas');
      }
    });
  }
}
