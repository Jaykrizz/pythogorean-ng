import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { apiErrorMessage } from '../../core/api-error';
import { Auth } from '../../core/services/auth';
import { Branch } from '../models/branch';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: false,
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class Register implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly form = this.formBuilder.nonNullable.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      branchId: [null as number | null, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  readonly branches = signal<Branch[]>([]);
  readonly branchesError = signal<string | null>(null);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.auth.getBranches().subscribe({
      next: (branches) => {
        this.branches.set(branches);

        if (branches.length === 0) {
          this.branchesError.set('No branches exist yet. Add one to the branches table first.');
        }
      },
      error: (error: unknown) => {
        this.branchesError.set(apiErrorMessage(error, 'Unable to load branches'));
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const { name, email, password, branchId } = this.form.getRawValue();

    this.auth
      .register({
        name,
        email,
        password,
        branchId: branchId as number,
        role: 'TEACHER',
      })
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (error: unknown) => {
          this.errorMessage.set(apiErrorMessage(error, 'Unable to create the account'));
          this.submitting.set(false);
        },
      });
  }
}
