import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { Layout } from './layout/layout';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';

@NgModule({
  declarations: [Layout, Navbar, Sidebar],
  imports: [SharedModule],
  exports: [Navbar],
})
export class CoreModule {}
