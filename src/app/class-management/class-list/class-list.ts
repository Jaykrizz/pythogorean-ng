import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { apiErrorMessage } from '../../core/api-error';
import { Auth } from '../../core/services/auth';
import { Classroom } from '../classroom';
import { ClassSummary } from '../models';

@Component({
  selector: 'app-class-list',
  standalone: false,
  styleUrl: './class-list.scss',
  templateUrl: './class-list.html',
})
export class ClassList implements OnInit {
  private readonly classroom = inject(Classroom);
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(Auth);

  readonly classes = signal<ClassSummary[]>([]);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
  });

  ngOnInit(): void {
    this.load();
  }

  logout(): void {
    this.auth.logout();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.classroom.create(this.form.controls.name.value.trim()).subscribe({
      next: () => {
        this.form.reset();
        this.submitting.set(false);
        this.load();
      },
      error: (error: unknown) => {
        this.errorMessage.set(apiErrorMessage(error, 'Unable to create the class'));
        this.submitting.set(false);
      },
    });
  }

  private load(): void {
    this.classroom.list().subscribe({
      next: (classes) => {
        this.classes.set(classes);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(apiErrorMessage(error, 'Unable to load classes'));
        this.loading.set(false);
      },
    });
  }
}
