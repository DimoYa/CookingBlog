import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadAnimationComponent } from './load-animation/load-animation.component';

@NgModule({
  declarations: [
    LoadAnimationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadAnimationComponent
  ]
})
export class SharedModule { }
