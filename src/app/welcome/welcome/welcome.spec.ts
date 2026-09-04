import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../../core/core-module';
import { SharedModule } from '../../shared/shared-module';
import { Welcome } from './welcome';

describe('Welcome', () => {
  let component: Welcome;
  let fixture: ComponentFixture<Welcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, CoreModule, RouterModule.forRoot([])],
      declarations: [Welcome],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Welcome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
