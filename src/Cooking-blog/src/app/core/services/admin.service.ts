import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import UserModel from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly baseUrl = environment.apiUserUrl;

  constructor(private httpClient: HttpClient) { }

  getAllUsers$(): Observable<UserModel[]> {
    return this.httpClient.get<UserModel[]>(`${this.baseUrl}/`);
  }

  suspendUser$(id: string): Observable<UserModel> {
    return this.httpClient.delete<UserModel>(`${this.baseUrl}/${id}?soft=true`, {
      headers: new HttpHeaders().set(
        'Response',
        'User disabled successfully'
      ),
    });
  }

  restoreUser$(id: string): Observable<UserModel> {
    return this.httpClient.post<UserModel>(`${this.baseUrl}/${id}/_restore`, {
      headers: new HttpHeaders().set(
        'Response',
        'User enabled successfully'
      ),
    });
  }

}
