import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../../core/core-module';
import { SharedModule } from '../../shared/shared-module';
import { ClassList } from './class-list';

describe('ClassList', () => {
  let component: ClassList;
  let fixture: ComponentFixture<ClassList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, CoreModule, RouterModule.forRoot([])],
      declarations: [ClassList],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
