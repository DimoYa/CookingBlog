import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import UserModel from 'src/app/core/models/user-model';
import { AdminService } from 'src/app/core/services/admin.service';

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css'],
})
export class AdminUserManagementComponent implements OnInit, OnDestroy {
  users!: UserModel[];
  pageSlice!: UserModel[];
  subscription: Subscription = new Subscription();
  startIndex!: number;
  endIndex!: number;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.adminService.getAllUsers$().subscribe((data) => {
        this.users = data;
        this.pageSlice = this.users.slice(0, 3);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  disableUser(userId: string): void {
    this.subscription.add(
      this.adminService.suspendUser$(userId).subscribe(() => {
        this.adminService.getAllUsers$().subscribe((data) => {
          this.users = data;
          this.pageSlice = this.users.slice(this.startIndex, this.endIndex);
        });
      })
    );
  }

  enableUser(userId: string): void {
    this.subscription.add(
      this.adminService.restoreUser$(userId).subscribe(() => {
        this.adminService.getAllUsers$().subscribe((data) => {
          this.users = data;
          this.pageSlice = this.users.slice(this.startIndex, this.endIndex);
        });
      })
    );
  }

  public OnPageChange(event: PageEvent): void {
    this.startIndex = event.pageIndex * event.pageSize;
    this.endIndex = this.startIndex + event.pageSize;
    if (this.endIndex > this.users.length) {
      this.endIndex = this.users.length;
    }
    this.pageSlice = this.users.slice(this.startIndex, this.endIndex);
  }
}
