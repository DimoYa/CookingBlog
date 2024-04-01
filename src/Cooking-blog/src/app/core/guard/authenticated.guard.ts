import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router) { }
  canActivate(): UrlTree | boolean {
    if (this.authenticationService.isLoggedIn()) {
      return this.router.createUrlTree(['/home']);
    }
    return true;
  }
}
