import { Routes, RouterModule } from "@angular/router";
import { AdminGuard } from "../core/guard/admin.guard";
import { AdminUserManagementComponent } from "./admin-user-management/admin-user-management.component";
import { AdminArticleManagementComponent } from "./admin-article-management/admin-article-management.component";

const routes: Routes = [
  { path: 'users', canActivate: [AdminGuard], component: AdminUserManagementComponent },
  { path: 'articles', canActivate: [AdminGuard], component: AdminArticleManagementComponent },
];

export const AdminRoutingModule = RouterModule.forChild(routes);