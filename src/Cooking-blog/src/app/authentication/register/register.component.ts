import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import {
  emailValidator,
  fullNameValidator,
  passwordMatch,
  phoneNumberValidator,
} from '../utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnDestroy {
  getCodes = ['359', '124', '152'];
  subscription: Subscription = new Subscription();

  passwordControl = new FormControl(null, [
    Validators.required,
    Validators.minLength(6),
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]/),
  ]);

  get passwordsGroup(): FormGroup {
    return this.registerFormGroup.controls['passwords'] as FormGroup;
  }

  registerFormGroup: FormGroup = this.formBuilder.group({
    email: new FormControl(null, [Validators.required, emailValidator]),
    fullname: new FormControl(null, [Validators.required, fullNameValidator]),
    passwords: new FormGroup({
      password: this.passwordControl,
      rePassword: new FormControl(null, [
        Validators.required,
        passwordMatch(this.passwordControl),
      ]),
    }),
    phoneCode: new FormControl(this.getCodes[0]),
    phoneNumber: new FormControl(null, phoneNumberValidator),
    photo: new FormControl(null),
  });

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  register(): void {
    const { email, fullname, phoneCode, phoneNumber, photo, passwords } =
      this.registerFormGroup.value;

    const body = {
      username: email,
      fullname: fullname,
      phoneCode: phoneCode,
      phoneNumber: phoneNumber,
      photo: photo,
      password: passwords.password,
    };

    this.subscription.add(
      this.authenticationService.register$(body).subscribe(() => {
        this.router.navigate(['user/login']);
      })
    );
  }

  get f() {
    return this.registerFormGroup.controls;
  }
}
