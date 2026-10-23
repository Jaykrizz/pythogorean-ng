import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { Assessment } from './assessment/assessment';

@NgModule({
  declarations: [Assessment],
  imports: [SharedModule],
})
export class AssessmentModule {}
