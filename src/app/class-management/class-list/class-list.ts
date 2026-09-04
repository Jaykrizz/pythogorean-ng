import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { apiErrorMessage } from '../../core/api-error';
import { ClassSummary } from '../models/class-summary';
import { Classes } from '../services/classes';

@Component({
  selector: 'app-class-list',
  standalone: false,
  styleUrl: './class-list.scss',
  templateUrl: './class-list.html',
})
export class ClassList implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly classes = inject(Classes);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
  });

  readonly items = signal<ClassSummary[]>([]);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.classes.createClass(this.form.getRawValue()).subscribe({
      next: (created) => {
        this.items.update((current) => [...current, created]);
        this.form.reset();
        this.submitting.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(apiErrorMessage(error, 'Unable to create the class'));
        this.submitting.set(false);
      },
    });
  }

  private load(): void {
    this.classes.getClasses().subscribe({
      next: (classes) => {
        this.items.set(classes);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(apiErrorMessage(error, 'Unable to load your classes'));
        this.loading.set(false);
      },
    });
  }
}
