import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import UserModel from 'src/app/core/models/user-model';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UserService } from 'src/app/core/services/user.service';
import { ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  defaultAvatarPath!: string;
  isAdmin!: boolean;
  currentUser$: Observable<UserModel>;
  userId!: string;
  subscription: Subscription = new Subscription();

  private readonly confirmMsg = 'Are you sure that you want to delete your account?';

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.defaultAvatarPath = '../../../assets/profile.png';
    this.currentUser$ = this.userService.getUser$(this.userId);
    this.isAdmin = this.authenticationService.isAdmin();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateUser(): void {
    this.router.navigate([`/user/profile/edit/${this.userId}`]);
  }

  deleteUser(): void {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle(this.confirmMsg);
    confirmBox.setButtonLabels('YES', 'NO');

    this.subscription.add(confirmBox.openConfirmBox$().subscribe((resp) => {
      if (resp.success) {
        this.subscription.add(this.userService.deleteUser$(this.userId).subscribe(() => {
          this.authenticationService.handleLogout();
          this.router.navigate(['/home']);
        }));
      }
    }));
  }
}
