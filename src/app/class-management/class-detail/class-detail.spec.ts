import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { ClassSections } from '../class-sections/class-sections';
import { ClassDetail } from './class-detail';

describe('ClassDetail', () => {
  let component: ClassDetail;
  let fixture: ComponentFixture<ClassDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, FormsModule, RouterModule.forRoot([]), ClassSections],
      declarations: [ClassDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
