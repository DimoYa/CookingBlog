import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import {
  EMPTY,
  Observable,
  Subscription,
  defaultIfEmpty,
  switchMap,
  tap,
} from 'rxjs';
import ArticleModel from 'src/app/core/models/article-model';
import CommentModel from 'src/app/core/models/comment-model';
import { ArticleService } from 'src/app/core/services/article.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CommentService } from 'src/app/core/services/comment.service';
import { FavoriteService } from 'src/app/core/services/favorite.service';
import { NavigationHistoryService } from 'src/app/core/services/navigation-history.service';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css'],
})
export class ArticleDetailsComponent implements OnInit, OnDestroy {
  article: ArticleModel;
  comments$: Observable<CommentModel[]>;

  subscription: Subscription = new Subscription();
  id: string;
  currentuserName: string;
  currentUserId: string;
  isAdmin: boolean;
  isExpanded = false;
  isFavorited = false;

  // Default to All Articles; overridden by navigation history
  private returnUrl = '/article/list';

  private readonly confirmMsg =
    'Are you sure that you want to delete the article?';

  constructor(
    private articleService: ArticleService,
    private commentService: CommentService,
    private authenticationService: AuthenticationService,
    private favoriteService: FavoriteService,
    private navigationHistory: NavigationHistoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const lastList = this.navigationHistory.getLastListUrl();

    if (lastList) {
      this.returnUrl = lastList;
    }

    console.log('RETURN URL =>', this.returnUrl); // temporary check

    this.subscription.add(
      this.route.params.subscribe((data) => {
        this.id = data['articleId'];

        this.articleService.getArticleById$(this.id).subscribe((article) => {
          this.article = article;
          this.comments$ = this.commentService.getAllCommentsByArticle$(
            this.id
          );

          if (this.canFavorite()) {
            this.checkFavoriteStatus();
          }
        });
      })
    );

    this.currentuserName = this.authenticationService.returnUserName();
    this.currentUserId = this.authenticationService.returnId();
    this.isAdmin = this.authenticationService.isAdmin();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  canModify(article: ArticleModel): boolean {
    return article.author === this.currentuserName || this.isAdmin;
  }

  canFavorite(): boolean {
    return this.currentuserName !== '' && this.article?.author !== this.currentuserName;
  }

  checkFavoriteStatus(): void {
    this.subscription.add(
      this.favoriteService
        .isFavorited$(this.currentUserId, this.id)
        .subscribe((isFav) => {
          this.isFavorited = isFav;
        })
    );
  }

  toggleFavorite(): void {
    if (!this.canFavorite()) {
      return;
    }

    if (this.isFavorited) {
      this.subscription.add(
        this.favoriteService
          .removeFavorite$(this.currentUserId, this.id)
          .subscribe({
            next: () => {
              this.isFavorited = false;
            },
          })
      );
    } else {
      this.subscription.add(
        this.favoriteService
          .addFavorite$(this.currentUserId, this.id)
          .subscribe({
            next: () => {
              this.isFavorited = true;
            },
          })
      );
    }
  }

  deleteArticle(id: string): void {
    if (!this.canModify(this.article)) {
      return;
    }

    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle(this.confirmMsg);
    confirmBox.setButtonLabels('YES', 'NO');

    this.subscription.add(
      confirmBox
        .openConfirmBox$()
        .pipe(
          switchMap((resp) => {
            if (!resp.success) {
              return EMPTY;
            }

            return this.articleService.deleteArticle$(id).pipe(
              switchMap(() =>
                this.commentService
                  .deleteAllCommentsByArticle$(id)
                  .pipe(defaultIfEmpty(null))
              ),
              switchMap(() =>
                this.favoriteService
                  .removeFavoriteByArticleId$(id)
                  .pipe(defaultIfEmpty(null))
              ),
              tap(() => {
                this.router.navigateByUrl(this.returnUrl);
              })
            );
          })
        )
        .subscribe()
    );
  }

  loadComments(): void {
    this.comments$ = this.commentService.getAllCommentsByArticle$(this.id);
    this.isExpanded = true;
  }
}