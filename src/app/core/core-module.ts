import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Layout } from './layout/layout';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';

@NgModule({
  declarations: [Layout, Navbar, Sidebar],
  imports: [CommonModule],
})
export class CoreModule {}
