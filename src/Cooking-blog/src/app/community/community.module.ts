import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityRoutingModule } from './community-routing.module';
import { CommunityHighlightsComponent } from './highlights/highlights.component';

@NgModule({
  declarations: [CommunityHighlightsComponent],
  imports: [CommonModule, CommunityRoutingModule],
})
export class CommunityModule {}
