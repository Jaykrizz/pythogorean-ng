import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../../core/core-module';
import { SharedModule } from '../../shared/shared-module';
import { ClassDetail } from './class-detail';

describe('ClassDetail', () => {
  let component: ClassDetail;
  let fixture: ComponentFixture<ClassDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, CoreModule, RouterModule.forRoot([])],
      declarations: [ClassDetail],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
