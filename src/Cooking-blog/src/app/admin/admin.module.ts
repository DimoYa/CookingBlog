import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserManagementComponent } from './admin-user-management/admin-user-management.component';
import { AdminRoutingModule } from './admin-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [AdminUserManagementComponent],
  imports: [CommonModule, AdminRoutingModule, MatPaginatorModule],
})
export class AdminModule { }
