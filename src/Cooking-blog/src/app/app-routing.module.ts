import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './feature/pages/landing/landing.component';
import { NotFoundComponent } from './feature/pages/not-found/not-found.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        component: LandingComponent
    },
    {
        path: 'user',
        loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    },
    {
        path: 'article',
        loadChildren: () => import('./feature/article/article.module').then(m => m.ArticleModule)/*, canLoad: [UserGuard]*/
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];

export const AppRoutingModule = RouterModule.forRoot(routes);