import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import UserModel from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly baseUrl = environment.apiUserUrl;


  currentAuthtoken: string;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  get authtoken() {
    return this.currentAuthtoken;
  }

  set authtoken(value: string) {
    this.currentAuthtoken = value;
  }

  login$(body: Object): Observable<UserModel> {
    return this.httpClient.post<UserModel>(`${this.baseUrl}/login`, body, {
      headers: new HttpHeaders().set(
        'Response',
        'Login successfully'
      ),
    });
  }

  register$(body: Object): Observable<UserModel> {
    return this.httpClient.post<UserModel>(`${this.baseUrl}`, body, {
      headers: new HttpHeaders().set(
        'Response',
        'Register successfully'
      ),
    });
  }

  logout$(): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}/_logout`, {}, {
      headers: new HttpHeaders().set(
        'Response',
        'Logout successfully'
      ),
    });
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

  handleLogin(data: UserModel): void {
    localStorage.setItem('authtoken', data['_kmd']['authtoken']);
    localStorage.setItem('username', data['username']);
    localStorage.setItem('id', data['_id']);
    localStorage.setItem('photo', data['photo']);
    data['_kmd']['roles'] !== undefined && data['_kmd']['roles'].length != 0
      ? localStorage.setItem('isAdmin', 'true')
      : localStorage.setItem('isAdmin', 'false');
  }

  handleLogout(): void {
    localStorage.clear();
  }
}
