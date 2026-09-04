import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core-module';
import { SharedModule } from '../shared/shared-module';
import { Login } from './login/login';
import { Register } from './register/register';

@NgModule({
  declarations: [Login, Register],
  imports: [SharedModule, CoreModule],
})
export class AuthModule {}
