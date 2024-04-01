import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { emailValidator } from '../utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  subscription: Subscription = new Subscription();

  loginFormGroup: FormGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required, emailValidator]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  login(): void {
    const { email, password } = this.loginFormGroup.value;

    const body = {
      username: email,
      password: password,
    };

    this.subscription.add(
      this.authenticationService.login$(body).subscribe(() => {
        this.router.navigate(['/home']);
      })
    );
  }

  get f() {
    return this.loginFormGroup.controls;
  }
}
