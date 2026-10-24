import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../core/services/api';
import { QuestionItem, SubjectItem, TopicItem } from './models';

export interface NewQuestion {
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctLetter: string;
  marks: number;
}

@Service()
export class Curriculum {
  private readonly api = inject(Api);

  list(): Observable<SubjectItem[]> {
    return this.api.get<SubjectItem[]>('/subjects');
  }

  createSubject(name: string): Observable<SubjectItem> {
    return this.api.post<SubjectItem>('/subjects', { name });
  }

  createTopic(subjectId: number, name: string): Observable<TopicItem> {
    return this.api.post<TopicItem>(`/subjects/${subjectId}/topics`, { name });
  }

  setShown(topicId: number, shown: boolean): Observable<TopicItem> {
    return this.api.patch<TopicItem>(`/topics/${topicId}`, { shown });
  }

  createQuestion(topicId: number, question: NewQuestion): Observable<QuestionItem> {
    return this.api.post<QuestionItem>(`/topics/${topicId}/questions`, question);
  }
}
