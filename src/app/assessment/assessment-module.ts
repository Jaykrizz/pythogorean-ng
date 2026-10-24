import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { Assessment } from './assessment/assessment';
import { LiveAssessment } from './live/live-assessment';

@NgModule({
  declarations: [Assessment, LiveAssessment],
  imports: [SharedModule],
})
export class AssessmentModule {}
