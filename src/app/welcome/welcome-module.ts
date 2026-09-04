import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core-module';
import { SharedModule } from '../shared/shared-module';
import { Welcome } from './welcome/welcome';

@NgModule({
  declarations: [Welcome],
  imports: [SharedModule, CoreModule],
})
export class WelcomeModule {}
