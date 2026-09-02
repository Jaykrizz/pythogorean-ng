import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassList } from './class-list/class-list';
import { ClassDetail } from './class-detail/class-detail';

@NgModule({
  declarations: [ClassList, ClassDetail],
  imports: [CommonModule],
})
export class ClassManagementModule {}
