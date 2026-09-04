import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ClassDetail } from './class-management/class-detail/class-detail';
import { ClassList } from './class-management/class-list/class-list';
import { authGuard } from './core/guards/auth-guard';
import { Welcome } from './welcome/welcome/welcome';

const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'classes', component: ClassList, canActivate: [authGuard] },
  { path: 'classes/:classId', component: ClassDetail, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
