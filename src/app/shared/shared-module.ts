import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TeacherTabs } from './teacher-tabs/teacher-tabs';

const SHARED_MODULES = [
  CommonModule,
  ReactiveFormsModule,
  RouterModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule,
];

@NgModule({
  declarations: [TeacherTabs],
  imports: SHARED_MODULES,
  exports: [...SHARED_MODULES, TeacherTabs],
})
export class SharedModule {}
