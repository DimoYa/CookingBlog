import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleMineComponent } from './article-mine.component';

describe('ArticleMineComponent', () => {
  let component: ArticleMineComponent;
  let fixture: ComponentFixture<ArticleMineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleMineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleMineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
