import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../core/services/api';
import { AssessmentItem, CapturedAnswer, LiveSession } from './models';

@Service()
export class AssessmentApi {
  private readonly api = inject(Api);

  list(): Observable<AssessmentItem[]> {
    return this.api.get<AssessmentItem[]>('/assessments');
  }

  create(name: string, classId: number, topicId: number): Observable<AssessmentItem> {
    return this.api.post<AssessmentItem>('/assessments', { name, classId, topicId });
  }

  session(id: number): Observable<LiveSession> {
    return this.api.get<LiveSession>(`/assessments/${id}`);
  }

  capture(id: number, image: Blob): Observable<{ answers: CapturedAnswer[] }> {
    const body = new FormData();
    body.append('image', image, 'capture.jpg');
    return this.api.post<{ answers: CapturedAnswer[] }>(`/assessments/${id}/capture`, body);
  }
}
