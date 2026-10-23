import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { AuthModule } from './auth/auth-module';
import { ClassManagementModule } from './class-management/class-management-module';
import { WelcomeModule } from './welcome/welcome-module';
import { authInterceptor } from './core/interceptors/auth-interceptor';

@NgModule({
  declarations: [App],
  imports: [BrowserModule, AppRoutingModule, WelcomeModule, AuthModule, ClassManagementModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
  bootstrap: [App],
})
export class AppModule {}
