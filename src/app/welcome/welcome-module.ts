import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { Welcome } from './welcome/welcome';

@NgModule({
  declarations: [Welcome],
  imports: [SharedModule],
})
export class WelcomeModule {}
