import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core-module';
import { SharedModule } from '../shared/shared-module';
import { ClassDetail } from './class-detail/class-detail';
import { ClassList } from './class-list/class-list';

@NgModule({
  declarations: [ClassList, ClassDetail],
  imports: [SharedModule, CoreModule],
})
export class ClassManagementModule {}
