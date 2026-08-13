import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import ArticleModel from 'src/app/core/models/article-model';
import { ArticleService } from 'src/app/core/services/article.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FavoriteService, Favorite } from 'src/app/core/services/favorite.service';

@Component({
  selector: 'app-article-favorites',
  templateUrl: './article-favorites.component.html',
  styleUrls: ['./article-favorites.component.css'],
})
export class ArticleFavoritesComponent implements OnInit {
  favorites: { article: ArticleModel; favorite: Favorite }[] = [];
  isLoading = true;
  userId: string;

  constructor(
    private favoriteService: FavoriteService,
    private articleService: ArticleService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.userId = this.authenticationService.returnId();
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.favoriteService
      .getFavoritesByUser$(this.userId)
      .pipe(
        switchMap((favorites) => {
          console.log('Favorites fetched:', favorites);
          
          if (favorites.length === 0) {
            this.favorites = [];
            this.isLoading = false;
            return of([]);
          }

          const articleRequests: Observable<ArticleModel>[] = favorites.map((fav) =>
            this.articleService.getArticleById$(fav.articleId).pipe(
              catchError((err) => {
                console.error(`Error fetching article ${fav.articleId}:`, err);
                return of(null as any);
              })
            )
          );

          return forkJoin(articleRequests).pipe(
            map((articles) => {
              const validArticles = articles.filter((a) => a !== null);
              console.log('Articles fetched:', validArticles);
              
              this.favorites = validArticles.map((article) => {
                const fav = favorites.find((f) => f.articleId === article._id);
                return { article, favorite: fav! };
              });
              return this.favorites;
            })
          );
        }),
        catchError((err) => {
          console.error('Error loading favorites:', err);
          this.favorites = [];
          return of([]);
        })
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Subscription error:', err);
          this.isLoading = false;
        },
      });
  }

  removeFavorite(articleId: string): void {
    this.favoriteService
      .removeFavorite$(this.userId, articleId)
      .subscribe({
        next: () => {
          this.favorites = this.favorites.filter(
            (f) => f.article._id !== articleId
          );
        },
      });
  }
}
