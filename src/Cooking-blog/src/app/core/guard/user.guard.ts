import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}
  canActivate(): boolean | UrlTree {
    if (this.authenticationService.isLoggedIn()) {
      return true;
    }
    return this.router.createUrlTree(['/user/login'])
  }
  canLoad(): boolean | UrlTree {
    if (this.authenticationService.isLoggedIn()) {
      return true;
    }
    return this.router.createUrlTree(['/user/login'])
  }
}
