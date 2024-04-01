import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from '../../core/guard/user.guard';
import { ArticleCreateComponent } from './article-create/article-create.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleMineComponent } from './article-mine/article-mine.component';

const routes: Routes = [
  { path: 'create', canActivate: [UserGuard], component: ArticleCreateComponent },
  { path: 'list', canActivate: [UserGuard], component: ArticleListComponent },
  { path: 'list/:articleId', canActivate: [UserGuard], component: ArticleDetailsComponent },
  { path: 'list/:articleId/edit', canActivate: [UserGuard], component: ArticleEditComponent },
  { path: 'myArticles', canActivate: [UserGuard], component: ArticleMineComponent },
];

export const ArticleRoutingModule = RouterModule.forChild(routes);