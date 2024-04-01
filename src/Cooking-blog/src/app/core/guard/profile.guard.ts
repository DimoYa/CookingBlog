import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const urlParams = state.url.split('/');
    const userToUpdateId = urlParams[urlParams.length - 1]
    const currentUserId = this.authenticationService.returnId();

    if (this.authenticationService.isAdmin() || userToUpdateId === currentUserId) {
      return true;
    }
    return this.router.createUrlTree(['/home']);
  }
}
