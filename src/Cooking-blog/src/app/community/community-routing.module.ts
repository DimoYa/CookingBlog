import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from '../core/guard/user.guard';
import { CommunityHighlightsComponent } from './highlights/highlights.component';

const routes: Routes = [
  { path: 'highlights', component: CommunityHighlightsComponent, canActivate: [UserGuard] },
];

export const CommunityRoutingModule = RouterModule.forChild(routes);
