import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { from, Observable } from 'rxjs';
import UserModel from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private toastr: ToastrService,
  ) {
    // Keep localStorage token fresh whenever Firebase silently refreshes it
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('authtoken', token);
        localStorage.setItem('id', firebaseUser.uid);
      } else {
        localStorage.clear();
      }
    });
  }

  login$(body: any): Observable<UserModel> {
    return from(
      signInWithEmailAndPassword(this.auth, body['username'], body['password'])
        .then(async (cred) => {
          const snap = await getDoc(doc(this.firestore, 'users', cred.user.uid));
          const profile = this.mapUser(cred.user.uid, snap.data() as any);
          if (profile.disabled) {
            await signOut(this.auth);
            throw new Error('Account is suspended.');
          }
          this.handleLogin(cred.user.uid, await cred.user.getIdToken(), profile);
          this.toastr.success('Login successfully');
          return profile;
        })
        .catch(err => {
          this.toastr.error(this.getAuthError(err));
          throw err;
        })
    );
  }

  register$(body: any): Observable<UserModel> {
    return from(
      createUserWithEmailAndPassword(this.auth, body.username, body.password)
        .then(async (cred) => {
          const raw = {
            fullname: body.fullname,
            username: body.username,
            email: body.username,
            phoneCode: body.phoneCode || '',
            phoneNumber: body.phoneNumber || '',
            photo: body.photo || '',
            isAdmin: false,
            disabled: false,
          };
          await setDoc(doc(this.firestore, 'users', cred.user.uid), raw);
          const profile = this.mapUser(cred.user.uid, raw);
          this.handleLogin(cred.user.uid, await cred.user.getIdToken(), profile);
          this.toastr.success('Register successfully');
          return profile;
        })
        .catch(err => {
          this.toastr.error(this.getAuthError(err));
          throw err;
        })
    );
  }

  logout$(): Observable<void> {
    return from(
      signOut(this.auth).then(() => {
        this.handleLogout();
        this.toastr.success('Logout successfully');
      })
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('authtoken') !== null;
  }

  returnId(): string {
    return localStorage.getItem('id');
  }

  returnUserName(): string {
    return localStorage.getItem('username');
  }

  returnUserPhoto(): string {
    return localStorage.getItem('photo');
  }

  isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  handleLogin(uid: string, token: string, profile: UserModel): void {
    localStorage.setItem('authtoken', token);
    localStorage.setItem('id', uid);
    localStorage.setItem('username', profile.username);
    localStorage.setItem('photo', profile.photo || '');
    localStorage.setItem('isAdmin', String(!!profile.isAdmin));
  }

  handleLogout(): void {
    localStorage.clear();
  }

  private getAuthError(err: any): string {
    const code: string = err?.code || '';
    const map: Record<string, string> = {
      'auth/invalid-credential':     'Invalid email or password.',
      'auth/user-not-found':         'No account found with this email.',
      'auth/wrong-password':         'Incorrect password.',
      'auth/email-already-in-use':   'An account with this email already exists.',
      'auth/weak-password':          'Password must be at least 6 characters.',
      'auth/invalid-email':          'Invalid email address.',
      'auth/user-disabled':          'This account has been disabled.',
      'auth/too-many-requests':      'Too many failed attempts. Please try again later.',
    };
    return map[code] || err?.message || 'An unexpected error occurred.';
  }

  mapUser(uid: string, data: any): UserModel {
    return {
      ...data,
      _id: uid,
      _kmd: {
        status: data?.disabled ? 'disabled' : undefined,
        roles: data?.isAdmin ? [{ role: 'admin' }] : undefined,
      },
    } as UserModel;
  }
}
