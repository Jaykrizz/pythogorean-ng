import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Classroom } from '../../class-management/classroom';
import { ClassSummary } from '../../class-management/models';
import { apiErrorMessage } from '../../core/api-error';
import { AssessmentApi } from '../assessment-api';
import { AssessmentItem, TopicChoice } from '../models';

@Component({
  selector: 'app-assessment',
  standalone: false,
  styleUrl: './assessment.scss',
  templateUrl: './assessment.html',
})
export class Assessment implements OnInit {
  private readonly assessmentsApi = inject(AssessmentApi);
  private readonly classroom = inject(Classroom);
  private readonly formBuilder = inject(FormBuilder);

  readonly assessments = signal<AssessmentItem[]>([]);
  readonly classes = signal<ClassSummary[]>([]);
  readonly topics = signal<TopicChoice[]>([]);
  readonly topicsReady = signal(false);
  readonly loading = signal(true);
  readonly creating = signal(false);
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    classId: [null as number | null, [Validators.required]],
    topicId: [null as number | null, [Validators.required]],
  });

  ngOnInit(): void {
    this.classroom.list().subscribe({
      next: (classes) => this.classes.set(classes),
      error: () => this.classes.set([]),
    });
    this.form.controls.classId.valueChanges.subscribe((classId) => this.loadTopics(classId));
    this.load();
  }

  openForm(): void {
    this.creating.set(true);
    this.errorMessage.set(null);
  }

  closeForm(): void {
    this.creating.set(false);
    this.form.reset({ name: '', classId: null, topicId: null });
    this.topics.set([]);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, classId, topicId } = this.form.getRawValue();
    this.submitting.set(true);
    this.errorMessage.set(null);

    this.assessmentsApi.create(name.trim(), classId as number, topicId as number).subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeForm();
        this.load();
      },
      error: (error: unknown) => {
        this.errorMessage.set(apiErrorMessage(error, 'Unable to create the assessment'));
        this.submitting.set(false);
      },
    });
  }

  private load(): void {
    this.assessmentsApi.list().subscribe({
      next: (assessments) => {
        this.assessments.set(assessments);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(apiErrorMessage(error, 'Unable to load assessments'));
        this.loading.set(false);
      },
    });
  }

  private loadTopics(classId: number | null): void {
    this.form.controls.topicId.setValue(null);
    this.topics.set([]);
    this.topicsReady.set(false);

    if (classId == null) {
      return;
    }

    this.classroom.detail(classId).subscribe({
      next: (detail) => {
        this.topics.set(
          detail.subjects.flatMap((subject) =>
            subject.topics
              .filter((topic) => topic.shown)
              .map((topic) => ({
                id: topic.id,
                label: `${subject.name} / ${topic.name}`,
              })),
          ),
        );
        this.topicsReady.set(true);
      },
      error: () => {
        this.topics.set([]);
        this.topicsReady.set(true);
      },
    });
  }
}
