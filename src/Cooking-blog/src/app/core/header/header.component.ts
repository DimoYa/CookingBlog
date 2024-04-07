import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnDestroy {
  isLogged: boolean;
  isAdmin: boolean;
  avatar: string;
  username: string;
  userId: string;
  isExpanded: boolean;
  defaultAvatarPath: string = '../../../assets/profile.png';
  subscription: Subscription = new Subscription();

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngDoCheck(): void {
    this.isLogged = this.authenticationService.isLoggedIn();
    this.isAdmin = this.authenticationService.isAdmin();
    this.avatar = this.authenticationService.returnUserPhoto();
    this.username = this.authenticationService.returnUserName();
    this.userId = this.authenticationService.returnId();
    this.isExpanded = false;
  }

  toggle(): void {
    this.isExpanded = !this.isExpanded;
  }

  logout(): void {
    this.subscription.add(
      this.authenticationService.logout$().subscribe(() => {
        this.router.navigate(['/user/login']);
      })
    );
  }
}
