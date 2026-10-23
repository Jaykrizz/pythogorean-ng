import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Classroom } from '../../class-management/classroom';
import { ClassSummary } from '../../class-management/models';
import { apiErrorMessage } from '../../core/api-error';
import { Auth } from '../../core/services/auth';
import { Role } from '../models/role';

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
export class Register implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly classroom = inject(Classroom);

  readonly roles: Role[] = ['TEACHER', 'STUDENT', 'PARENT'];
  readonly classes = signal<ClassSummary[]>([]);

  readonly form = this.formBuilder.nonNullable.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['TEACHER' as Role, [Validators.required]],
      classId: [null as number | null],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly cardUrl = signal<string | null>(null);

  ngOnInit(): void {
    this.classroom.list().subscribe({
      next: (classes) => this.classes.set(classes),
      error: () => this.classes.set([]),
    });
  }

  ngOnDestroy(): void {
    this.clearCard();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { name, email, password, role, classId } = this.form.getRawValue();

    if (role === 'STUDENT' && classId == null) {
      this.errorMessage.set('Choose a class so the student gets a card.');
      this.submitting.set(false);
      return;
    }

    this.auth.register({ name, email, password, role, classId: role === 'STUDENT' ? classId : null }).subscribe({
      next: (created) => {
        const cardNote = created.markerId == null ? '' : ` Card marker ${created.markerId}.`;
        this.successMessage.set(`${created.name} can now sign in as ${created.role.toLowerCase()}.${cardNote}`);
        this.clearCard();
        if (created.markerId != null) {
          this.classroom.card(created.id).subscribe({
            next: (blob) => this.cardUrl.set(URL.createObjectURL(blob)),
          });
        }
        this.form.reset({
          name: '',
          email: '',
          role: 'TEACHER',
          classId: null,
          password: '',
          confirmPassword: '',
        });
        this.submitting.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(apiErrorMessage(error, 'Unable to create the account'));
        this.submitting.set(false);
      },
    });
  }

  private clearCard(): void {
    const url = this.cardUrl();
    if (url) {
      URL.revokeObjectURL(url);
    }
    this.cardUrl.set(null);
  }
}
