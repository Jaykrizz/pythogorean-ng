import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-class-sections',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './class-sections.html',
})
export class ClassSections {
  private readonly router = inject(Router);

  readonly subjects = signal(this.router.url.startsWith('/classes/subjects'));

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.subjects.set(event.urlAfterRedirects.startsWith('/classes/subjects'));
      }
    });
  }
}
