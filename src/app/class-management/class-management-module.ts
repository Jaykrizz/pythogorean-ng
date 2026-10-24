import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared-module';
import { ClassDetail } from './class-detail/class-detail';
import { ClassList } from './class-list/class-list';
import { ClassSections } from './class-sections/class-sections';
import { SubjectBank } from './subject-bank/subject-bank';

@NgModule({
  declarations: [ClassList, ClassDetail, SubjectBank],
  imports: [SharedModule, FormsModule, ClassSections],
})
export class ClassManagementModule {}

