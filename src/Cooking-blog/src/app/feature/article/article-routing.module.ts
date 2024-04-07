import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from '../../core/guard/user.guard';
import { ArticleCreateComponent } from './article-create/article-create.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleMineComponent } from './article-mine/article-mine.component';

const routes: Routes = [
  { path: 'create', component: ArticleCreateComponent },
  { path: 'list', component: ArticleListComponent },
  { path: 'list/:articleId', component: ArticleDetailsComponent },
  { path: 'list/:articleId/edit', component: ArticleEditComponent },
  { path: 'myArticles', component: ArticleMineComponent },
];

export const ArticleRoutingModule = RouterModule.forChild(routes);