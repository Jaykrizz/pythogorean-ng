import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from '../../core/services/api';
import { AddStudentRequest } from '../models/add-student-request';
import { ClassSummary } from '../models/class-summary';
import { CreateClassRequest } from '../models/create-class-request';
import { Student } from '../models/student';

@Service()
export class Classes {
  private readonly api = inject(Api);

  getClasses(): Observable<ClassSummary[]> {
    return this.api.get<ClassSummary[]>('/classes');
  }

  getClass(classId: number): Observable<ClassSummary> {
    return this.api.get<ClassSummary>(`/classes/${classId}`);
  }

  createClass(request: CreateClassRequest): Observable<ClassSummary> {
    return this.api.post<ClassSummary>('/classes', request);
  }

  getStudents(classId: number): Observable<Student[]> {
    return this.api.get<Student[]>(`/classes/${classId}/students`);
  }

  addStudent(classId: number, request: AddStudentRequest): Observable<Student> {
    return this.api.post<Student>(`/classes/${classId}/students`, request);
  }

  getCardImage(studentId: number): Observable<Blob> {
    return this.api.getBlob(`/students/${studentId}/card`);
  }

  regenerateCard(studentId: number): Observable<Student> {
    return this.api.post<Student>(`/students/${studentId}/card`, {});
  }
}
