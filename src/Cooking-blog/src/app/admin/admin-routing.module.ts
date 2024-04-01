import { Routes, RouterModule } from "@angular/router";
import { AdminGuard } from "../core/guard/admin.guard";
import { AdminUserManagementComponent } from "./admin-user-management/admin-user-management.component";

const routes: Routes = [
  { path: 'users', canActivate: [AdminGuard], component: AdminUserManagementComponent },
];

export const AdminRoutingModule = RouterModule.forChild(routes);