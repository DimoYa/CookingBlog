import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ProfileComponent } from "./profile/profile.component";
import { ProfileUpdateComponent } from "./profile-update/profile-update.component";
import { AuthenticatedGuard } from "../core/guard/authenticated.guard";
import { ProfileGuard } from "../core/guard/profile.guard";

const routes: Routes = [
  { path: 'register', canActivate: [AuthenticatedGuard], component: RegisterComponent },
  { path: 'login', canActivate: [AuthenticatedGuard], component: LoginComponent },
  { path: 'profile/:id', canActivate: [ProfileGuard], component: ProfileComponent },
  { path: 'profile/edit/:id', canActivate: [ProfileGuard], component: ProfileUpdateComponent },
];

export const AuthenticationRoutingModule = RouterModule.forChild(routes);