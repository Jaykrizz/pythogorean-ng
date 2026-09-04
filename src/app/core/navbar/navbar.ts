import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: false,
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly session = this.auth.session;

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
