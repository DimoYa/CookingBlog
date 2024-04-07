import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadAnimationComponent } from './load-animation.component';

describe('LoadAnimationComponent', () => {
  let component: LoadAnimationComponent;
  let fixture: ComponentFixture<LoadAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadAnimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
