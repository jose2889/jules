import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasStoredAuth());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Credenciales estáticas
  private readonly VALID_USERNAME = 'admin';
  private readonly VALID_PASSWORD = '2889';

  constructor(private router: Router) {}

  private hasStoredAuth(): boolean {
    // Verificar si hay una sesión guardada en localStorage
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  login(username: string, password: string): boolean {
    if (username === this.VALID_USERNAME && password === this.VALID_PASSWORD) {
      localStorage.setItem('isAuthenticated', 'true');
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}

