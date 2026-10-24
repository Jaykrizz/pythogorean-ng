import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../core/services/api';
import { ClassDetail, ClassSummary, PersonOption, StudentCard, SubjectItem } from './models';

@Service()
export class Classroom {
  private readonly api = inject(Api);

  list(): Observable<ClassSummary[]> {
    return this.api.get<ClassSummary[]>('/classes');
  }

  create(name: string): Observable<ClassSummary> {
    return this.api.post<ClassSummary>('/classes', { name });
  }

  detail(id: number): Observable<ClassDetail> {
    return this.api.get<ClassDetail>(`/classes/${id}`);
  }

  linkSubject(classId: number, subjectId: number): Observable<SubjectItem> {
    return this.api.post<SubjectItem>(`/classes/${classId}/subjects`, { subjectId });
  }

  availableSubjects(classId: number): Observable<PersonOption[]> {
    return this.api.get<PersonOption[]>(`/classes/${classId}/available-subjects`);
  }

  availableStudents(classId: number): Observable<PersonOption[]> {
    return this.api.get<PersonOption[]>(`/classes/${classId}/available-students`);
  }

  enroll(classId: number, studentId: number): Observable<StudentCard> {
    return this.api.post<StudentCard>(`/classes/${classId}/students`, { studentId });
  }

  card(studentId: number): Observable<Blob> {
    return this.api.getBlob(`/students/${studentId}/card`);
  }
}
