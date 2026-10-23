import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../core/services/api';
import { AssessmentItem } from './models';

@Service()
export class AssessmentApi {
  private readonly api = inject(Api);

  list(): Observable<AssessmentItem[]> {
    return this.api.get<AssessmentItem[]>('/assessments');
  }

  create(name: string, topicId: number): Observable<AssessmentItem> {
    return this.api.post<AssessmentItem>('/assessments', { name, topicId });
  }
}
