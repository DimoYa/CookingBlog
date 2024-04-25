import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import ArticleModel from '../models/article-model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  private readonly baseUrl = environment.apiAppUrl;
  private readonly articleEndPoint = `${this.baseUrl}/article`;

  createArticle$(body: ArticleModel): Observable<ArticleModel> {
    return this.httpClient.post<ArticleModel>(this.articleEndPoint, body, {
      headers: new HttpHeaders().set(
        'Response',
        'Article created successfully'
      ),
    });
  }

  getArticles$(): Observable<ArticleModel[]> {
    return this.httpClient.get<ArticleModel[]>(
      `${this.articleEndPoint}?query={}&sort={"_kmd.ect": -1}`
    );
  }

  getArticleById$(id: string): Observable<ArticleModel> {
    return this.httpClient.get<ArticleModel>(`${this.articleEndPoint}/${id}`);
  }

  getUserArticles$(): Observable<ArticleModel[]> {
    const currentUser = this.authenticationService.returnUserName();
    return this.httpClient.get<ArticleModel[]>(
      `${this.baseUrl}/article?query={"author":"${currentUser}"}&sort={"_kmd.ect": -1}`
    );
  }

  deleteArticle$(id: string): Observable<ArticleModel> {
    return this.httpClient.delete<ArticleModel>(
      `${this.articleEndPoint}/${id}`,
      {
        headers: new HttpHeaders().set(
          'Response',
          'Article deleted successfully'
        ),
      }
    );
  }

  editArticle$(body: ArticleModel, id: string) {
    return this.httpClient.put<ArticleModel>(
      `${this.articleEndPoint}/${id}`,
      body,
      {
        headers: new HttpHeaders().set(
          'Response',
          'Article updated successfully'
        ),
      }
    );
  }
}
