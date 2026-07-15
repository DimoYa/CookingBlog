import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserManagementComponent } from './admin-user-management/admin-user-management.component';
import { AdminArticleManagementComponent } from './admin-article-management/admin-article-management.component';
import { AdminRoutingModule } from './admin-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AdminUserManagementComponent, AdminArticleManagementComponent],
  imports: [CommonModule, AdminRoutingModule, MatPaginatorModule, RouterModule],
})
export class AdminModule { }
