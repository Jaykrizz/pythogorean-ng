import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { apiErrorMessage } from '../../core/api-error';
import { AssessmentApi } from '../assessment-api';
import { LiveQuestion, LiveSession } from '../models';

interface Shot {
  letters: Record<number, string>;
  revealed: boolean;
}

@Component({
  selector: 'app-live-assessment',
  standalone: false,
  templateUrl: './live-assessment.html',
})
export class LiveAssessment implements OnInit, OnDestroy {
  private readonly assessments = inject(AssessmentApi);
  private readonly route = inject(ActivatedRoute);
  private assessmentId = 0;
  private stream: MediaStream | null = null;

  @ViewChild('camera') camera?: ElementRef<HTMLVideoElement>;

  readonly session = signal<LiveSession | null>(null);
  readonly index = signal(0);
  readonly shots = signal<Record<number, Shot>>({});
  readonly loading = signal(true);
  readonly capturing = signal(false);
  readonly cameraReady = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.assessmentId = Number(this.route.snapshot.paramMap.get('id'));
    this.assessments.session(this.assessmentId).subscribe({
      next: (session) => {
        this.session.set(session);
        this.loading.set(false);
        if (session.questions.length > 0) {
          setTimeout(() => this.startCamera());
        }
      },
      error: (error: unknown) => {
        this.errorMessage.set(apiErrorMessage(error, 'Unable to open this assessment'));
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy(): void {
    this.stream?.getTracks().forEach((track) => track.stop());
  }

  question(): LiveQuestion | null {
    return this.session()?.questions[this.index()] ?? null;
  }

  previous(): void {
    this.showQuestion(Math.max(0, this.index() - 1));
  }

  next(): void {
    const last = (this.session()?.questions.length ?? 1) - 1;
    this.showQuestion(Math.min(last, this.index() + 1));
  }

  seeAnswer(): void {
    const question = this.question();
    if (!question || this.revealed()) {
      return;
    }

    this.shots.update((shots) => {
      const current = shots[question.id] ?? { letters: {}, revealed: false };
      return { ...shots, [question.id]: { ...current, revealed: true } };
    });
    this.errorMessage.set(null);
    this.stopCamera();
  }

  revealed(): boolean {
    const question = this.question();
    return question != null && (this.shots()[question.id]?.revealed ?? false);
  }

  boxTone(studentId: number): 'grey' | 'blue' | 'green' | 'yellow' {
    const question = this.question();
    const shot = question ? this.shots()[question.id] : undefined;
    const letter = shot?.letters[studentId];

    if (!letter) {
      return 'grey';
    }

    if (!shot?.revealed) {
      return 'blue';
    }

    return letter === question?.correctLetter ? 'green' : 'yellow';
  }

  chosenLetter(studentId: number): string | null {
    const question = this.question();
    if (!question || !this.shots()[question.id]?.revealed) {
      return null;
    }

    return this.shots()[question.id].letters[studentId] ?? null;
  }

  capture(): void {
    const video = this.camera?.nativeElement;
    const question = this.question();
    if (!video || !video.videoWidth || !question || this.capturing() || this.revealed()) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.drawImage(video, 0, 0);
    this.capturing.set(true);
    this.errorMessage.set(null);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          this.capturing.set(false);
          this.errorMessage.set('Unable to capture the camera');
          return;
        }

        this.assessments.capture(this.assessmentId, blob).subscribe({
          next: (result) => {
            const letters: Record<number, string> = {};
            for (const answer of result.answers) {
              letters[answer.studentId] = answer.letter;
            }
            this.shots.update((shots) => ({
              ...shots,
              [question.id]: { letters, revealed: shots[question.id]?.revealed ?? false },
            }));
            this.capturing.set(false);
            if (result.answers.length === 0 && this.question()?.id === question.id && !this.revealed()) {
              this.errorMessage.set('No cards found in this photo.');
            }
          },
          error: (error: unknown) => {
            this.errorMessage.set(apiErrorMessage(error, 'Unable to read the cards'));
            this.capturing.set(false);
          },
        });
      },
      'image/jpeg',
      0.92,
    );
  }

  private showQuestion(nextIndex: number): void {
    if (nextIndex === this.index()) {
      return;
    }

    this.index.set(nextIndex);
    this.errorMessage.set(null);
    if (this.revealed()) {
      this.stopCamera();
      return;
    }

    if (!this.cameraReady()) {
      setTimeout(() => this.startCamera());
    }
  }

  private async startCamera(): Promise<void> {
    this.stopCamera();

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      const video = this.camera?.nativeElement;
      if (!video) {
        this.stopCamera();
        return;
      }
      video.srcObject = this.stream;
      await video.play();
      this.cameraReady.set(true);
    } catch {
      this.stopCamera();
      this.errorMessage.set('Allow the camera to capture cards.');
    }
  }

  private stopCamera(): void {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    const video = this.camera?.nativeElement;
    if (video) {
      video.srcObject = null;
    }
    this.cameraReady.set(false);
  }
}
