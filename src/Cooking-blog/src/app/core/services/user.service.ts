import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import UserModel from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = environment.apiUserUrl;

  constructor(private httpClient: HttpClient) { }

  updateUser$(usrModel: UserModel, id: string): Observable<UserModel> {
    return this.httpClient.put<UserModel>(`${this.baseUrl}/${id}`, usrModel, {
      headers: new HttpHeaders().set(
        'Response',
        'User updated successfully'
      ),
    });
  }

  deleteUser$(id: string): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}?hard=true`, {
      headers: new HttpHeaders().set(
        'Response',
        'User deleted successfully'
      ),
    });
  }

  getUser$(profileId: string): Observable<UserModel> {
    return this.httpClient.get<UserModel>(`${this.baseUrl}/${profileId}`);
  }
}