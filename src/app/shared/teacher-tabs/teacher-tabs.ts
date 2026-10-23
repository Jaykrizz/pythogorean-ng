import { Component, computed, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-teacher-tabs',
  standalone: false,
  styleUrl: './teacher-tabs.scss',
  templateUrl: './teacher-tabs.html',
})
export class TeacherTabs {
  private readonly auth = inject(Auth);

  readonly teacher = computed(() => this.auth.session()?.role === 'TEACHER');
}
