import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import CommentModel from '../models/comment-model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private httpClient: HttpClient) { }

  private readonly baseUrl = environment.apiAppUrl;
  private readonly commentEndPoint = `${this.baseUrl}/comment`;

  getAllCommentsByArticle$(articleId: string): Observable<CommentModel[]> {
    return this.httpClient.get<CommentModel[]>(
      `${this.commentEndPoint}?query={"articleId":"${articleId}"}&sort={"likes.length": -1}`
    );
  }

  addComment$(body: CommentModel): Observable<CommentModel> {
    return this.httpClient.post<CommentModel>(this.commentEndPoint, body, {
      headers: new HttpHeaders().set(
        'Response',
        'Comment created successfully'
      ),
    });
  }

  deleteComment$(id: string): Observable<CommentModel> {
    return this.httpClient.delete<CommentModel>(
      `${this.commentEndPoint}/${id}`,
      {
        headers: new HttpHeaders().set(
          'Response',
          'Comment deleted successfully'
        ),
      }
    );
  }

  deleteAllCommentsByArticle$(articleId: string): Observable<CommentModel[]> {
    return this.httpClient.delete<CommentModel[]>(
      `${this.commentEndPoint}?query={"articleId":"${articleId}"}`
    );
  }

  getCommentById$(id: string): Observable<CommentModel> {
    return this.httpClient.get<CommentModel>(`${this.commentEndPoint}/${id}`);
  }

  editComment$(body: CommentModel, id: string, operation: string) : Observable<CommentModel> {
    return this.httpClient.put<CommentModel>(`${this.commentEndPoint}/${id}`, body, {
      headers: new HttpHeaders().set(
        'Response',
        `Comment ${operation} successfully`
      ),
    });
  }
}
