import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { apiErrorMessage } from '../../core/api-error';
import { Curriculum } from '../curriculum';
import { SubjectItem } from '../models';

@Component({
  selector: 'app-subject-bank',
  standalone: false,
  templateUrl: './subject-bank.html',
})
export class SubjectBank implements OnInit {
  private readonly curriculum = inject(Curriculum);
  private readonly formBuilder = inject(FormBuilder);

  readonly subjects = signal<SubjectItem[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly questionTopicId = signal<number | null>(null);
  readonly openSubjectIds = signal<number[]>([]);
  readonly openTopicIds = signal<number[]>([]);
  readonly topicDrafts: Record<number, string> = {};
  readonly letters = ['A', 'B', 'C', 'D'];

  readonly subjectForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
  });

  readonly questionForm = this.formBuilder.nonNullable.group({
    prompt: ['', [Validators.required, Validators.maxLength(500)]],
    optionA: ['', [Validators.required, Validators.maxLength(200)]],
    optionB: ['', [Validators.required, Validators.maxLength(200)]],
    optionC: ['', [Validators.required, Validators.maxLength(200)]],
    optionD: ['', [Validators.required, Validators.maxLength(200)]],
    correctLetter: ['A', [Validators.required]],
    marks: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.load();
  }

  addSubject(): void {
    if (this.subjectForm.invalid) {
      this.subjectForm.markAllAsTouched();
      return;
    }

    this.curriculum.createSubject(this.subjectForm.controls.name.value.trim()).subscribe({
      next: (subject) => {
        this.subjectForm.reset({ name: '' });
        this.openSubject(subject.id);
        this.load();
      },
      error: (error: unknown) => this.errorMessage.set(apiErrorMessage(error, 'Unable to add the subject')),
    });
  }

  addTopic(subjectId: number): void {
    const name = (this.topicDrafts[subjectId] ?? '').trim();
    if (!name) {
      return;
    }

    this.curriculum.createTopic(subjectId, name).subscribe({
      next: (topic) => {
        this.topicDrafts[subjectId] = '';
        this.openSubject(subjectId);
        this.openTopic(topic.id);
        this.load();
      },
      error: (error: unknown) => this.errorMessage.set(apiErrorMessage(error, 'Unable to add the topic')),
    });
  }

  toggleSubject(subjectId: number): void {
    this.openSubjectIds.update((ids) =>
      ids.includes(subjectId) ? ids.filter((id) => id !== subjectId) : [...ids, subjectId],
    );
  }

  toggleTopic(topicId: number): void {
    this.openTopicIds.update((ids) =>
      ids.includes(topicId) ? ids.filter((id) => id !== topicId) : [...ids, topicId],
    );
  }

  setShown(topicId: number, shown: boolean): void {
    this.curriculum.setShown(topicId, shown).subscribe({
      next: () => {
        this.subjects.update((subjects) =>
          subjects.map((subject) => ({
            ...subject,
            topics: subject.topics.map((topic) => (topic.id === topicId ? { ...topic, shown } : topic)),
          })),
        );
      },
      error: (error: unknown) => this.errorMessage.set(apiErrorMessage(error, 'Unable to update the question set')),
    });
  }

  openQuestion(topicId: number): void {
    this.openTopic(topicId);
    this.questionTopicId.set(topicId);
    this.questionForm.reset({
      prompt: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctLetter: 'A',
      marks: 1,
    });
  }

  addQuestion(): void {
    const topicId = this.questionTopicId();
    if (topicId == null || this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    const value = this.questionForm.getRawValue();
    this.curriculum.createQuestion(topicId, value).subscribe({
      next: () => {
        this.questionTopicId.set(null);
        this.load();
      },
      error: (error: unknown) => this.errorMessage.set(apiErrorMessage(error, 'Unable to add the question')),
    });
  }

  private openSubject(subjectId: number): void {
    this.openSubjectIds.update((ids) => (ids.includes(subjectId) ? ids : [...ids, subjectId]));
  }

  private openTopic(topicId: number): void {
    this.openTopicIds.update((ids) => (ids.includes(topicId) ? ids : [...ids, topicId]));
  }

  private load(): void {
    this.curriculum.list().subscribe({
      next: (subjects) => {
        this.subjects.set(subjects);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(apiErrorMessage(error, 'Unable to load subjects'));
        this.loading.set(false);
      },
    });
  }
}
