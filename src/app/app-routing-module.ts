import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Assessment } from './assessment/assessment/assessment';
import { LiveAssessment } from './assessment/live/live-assessment';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ClassDetail } from './class-management/class-detail/class-detail';
import { ClassList } from './class-management/class-list/class-list';
import { SubjectBank } from './class-management/subject-bank/subject-bank';
import { teacherGuard } from './core/guards/teacher-guard';
import { Welcome } from './welcome/welcome/welcome';

const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'login', component: Login },
  { path: 'register', component: Register, canActivate: [teacherGuard] },
  { path: 'classes/subjects', component: SubjectBank, canActivate: [teacherGuard] },
  { path: 'classes', component: ClassList, canActivate: [teacherGuard] },
  { path: 'classes/:id', component: ClassDetail, canActivate: [teacherGuard] },
  { path: 'assessments', component: Assessment, canActivate: [teacherGuard] },
  { path: 'assessments/:id', component: LiveAssessment, canActivate: [teacherGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
