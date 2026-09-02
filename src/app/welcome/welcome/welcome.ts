import { Component, inject } from '@angular/core';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-welcome',
  standalone: false,
  styleUrl: './welcome.scss',
  templateUrl: './welcome.html',
})
export class Welcome {
  private readonly auth = inject(Auth);

  readonly session = this.auth.session;

  readonly highlights = [
    {
      icon: 'photo_camera',
      title: 'One camera sweep',
      text: 'Students hold up a card. The classroom answers in seconds, without handing out a single device.',
    },
    {
      icon: 'bolt',
      title: 'Answers as they happen',
      text: 'Every card is matched to a student and scored the moment it is read.',
    },
    {
      icon: 'groups',
      title: 'Teacher, student, parent',
      text: 'Three corners, one picture of how a class is really doing.',
    },
  ];

  logout(): void {
    this.auth.logout();
  }
}
