import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { apiErrorMessage } from '../../core/api-error';
import { ClassSummary } from '../models/class-summary';
import { Student } from '../models/student';
import { Classes } from '../services/classes';

@Component({
  selector: 'app-class-detail',
  standalone: false,
  styleUrl: './class-detail.scss',
  templateUrl: './class-detail.html',
})
export class ClassDetail implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly classes = inject(Classes);
  private readonly route = inject(ActivatedRoute);

  private readonly classId = Number(this.route.snapshot.paramMap.get('classId'));

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  readonly classSummary = signal<ClassSummary | null>(null);
  readonly students = signal<Student[]>([]);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly addedMessage = signal<string | null>(null);
  readonly busyStudentId = signal<number | null>(null);

  ngOnInit(): void {
    this.classes.getClass(this.classId).subscribe({
      next: (summary) => this.classSummary.set(summary),
      error: (error: unknown) =>
        this.errorMessage.set(apiErrorMessage(error, 'Unable to load this class')),
    });

    this.classes.getStudents(this.classId).subscribe({
      next: (students) => {
        this.students.set(students);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(apiErrorMessage(error, 'Unable to load the students'));
        this.loading.set(false);
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
    this.addedMessage.set(null);

    this.classes
      .addStudent(this.classId, this.form.getRawValue())
      .subscribe({
        next: (student) => {
          this.students.update((current) =>
            [...current, student].sort((a, b) => a.arucoMarkerId - b.arucoMarkerId),
          );
          this.addedMessage.set(
            `${student.name} was assigned card ${student.arucoMarkerId}. Hand them that printed card.`,
          );
          this.form.reset();
          this.submitting.set(false);
        },
        error: (error: unknown) => {
          this.errorMessage.set(apiErrorMessage(error, 'Unable to add the student'));
          this.submitting.set(false);
        },
      });
  }

  downloadCard(student: Student): void {
    this.busyStudentId.set(student.id);
    this.errorMessage.set(null);

    this.classes.getCardImage(student.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `card-${student.arucoMarkerId}-${student.name.replace(/\s+/g, '-')}.png`;
        link.click();

        URL.revokeObjectURL(url);
        this.busyStudentId.set(null);
      },
      error: () => {
        this.errorMessage.set(`Could not download the card for ${student.name}`);
        this.busyStudentId.set(null);
      },
    });
  }

  generateCard(student: Student): void {
    this.busyStudentId.set(student.id);
    this.errorMessage.set(null);

    this.classes.regenerateCard(student.id).subscribe({
      next: (updated) => {
        this.students.update((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
        this.addedMessage.set(`Card ${updated.arucoMarkerId} generated for ${updated.name}`);
        this.busyStudentId.set(null);
      },
      error: (error: unknown) => {
        this.errorMessage.set(apiErrorMessage(error, 'Unable to generate the card'));
        this.busyStudentId.set(null);
      },
    });
  }
}
