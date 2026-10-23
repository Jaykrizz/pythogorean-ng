import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared-module';
import { ClassDetail } from './class-detail/class-detail';
import { ClassList } from './class-list/class-list';

@NgModule({
  declarations: [ClassList, ClassDetail],
  imports: [SharedModule, FormsModule],
})
export class ClassManagementModule {}
