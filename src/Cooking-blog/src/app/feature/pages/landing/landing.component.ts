import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {

  isLogged = this.authenticationService.isLoggedIn();
  isAdmin = this.authenticationService.isAdmin();
  userId = this.authenticationService.returnId();

  constructor(private authenticationService: AuthenticationService) { }
}
