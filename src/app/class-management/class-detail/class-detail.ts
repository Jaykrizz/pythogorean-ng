import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { apiErrorMessage } from '../../core/api-error';
import { Classroom } from '../classroom';
import { ClassDetail as ClassDetailModel, PersonOption } from '../models';

@Component({
  selector: 'app-class-detail',
  standalone: false,
  styleUrl: './class-detail.scss',
  templateUrl: './class-detail.html',
})
export class ClassDetail implements OnInit, OnDestroy {
  private readonly classroom = inject(Classroom);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);

  readonly detail = signal<ClassDetailModel | null>(null);
  readonly available = signal<PersonOption[]>([]);
  readonly errorMessage = signal<string | null>(null);
  readonly cardUrl = signal<string | null>(null);
  readonly cardStudentId = signal<number | null>(null);
  readonly topicDrafts: Record<number, string> = {};

  readonly subjectForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
  });

  readonly enrollForm = this.formBuilder.nonNullable.group({
    studentId: [null as number | null, [Validators.required]],
  });

  private classId = 0;

  ngOnInit(): void {
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    this.reload();
  }

  ngOnDestroy(): void {
    this.clearCard();
  }

  addSubject(): void {
    if (this.subjectForm.invalid) {
      this.subjectForm.markAllAsTouched();
      return;
    }

    this.classroom.addSubject(this.classId, this.subjectForm.controls.name.value.trim()).subscribe({
      next: () => {
        this.subjectForm.reset();
        this.reload();
      },
      error: (error: unknown) => this.errorMessage.set(apiErrorMessage(error, 'Unable to add the subject')),
    });
  }

  addTopic(subjectId: number): void {
    const name = (this.topicDrafts[subjectId] ?? '').trim();
    if (!name) {
      return;
    }

    this.classroom.addTopic(subjectId, name).subscribe({
      next: () => {
        this.topicDrafts[subjectId] = '';
        this.reload();
      },
      error: (error: unknown) => this.errorMessage.set(apiErrorMessage(error, 'Unable to add the topic')),
    });
  }

  enroll(): void {
    const studentId = this.enrollForm.controls.studentId.value;
    if (studentId == null) {
      this.enrollForm.markAllAsTouched();
      return;
    }

    this.classroom.enroll(this.classId, studentId).subscribe({
      next: () => {
        this.enrollForm.reset({ studentId: null });
        this.reload();
      },
      error: (error: unknown) => this.errorMessage.set(apiErrorMessage(error, 'Unable to add the student')),
    });
  }

  showCard(studentId: number): void {
    this.classroom.card(studentId).subscribe({
      next: (blob) => {
        this.clearCard();
        this.cardUrl.set(URL.createObjectURL(blob));
        this.cardStudentId.set(studentId);
      },
      error: (error: unknown) => this.errorMessage.set(apiErrorMessage(error, 'Unable to load the card')),
    });
  }

  private reload(): void {
    this.errorMessage.set(null);
    this.classroom.detail(this.classId).subscribe({
      next: (detail) => this.detail.set(detail),
      error: (error: unknown) => this.errorMessage.set(apiErrorMessage(error, 'Unable to load this class')),
    });
    this.classroom.availableStudents(this.classId).subscribe({
      next: (students) => this.available.set(students),
      error: () => this.available.set([]),
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
