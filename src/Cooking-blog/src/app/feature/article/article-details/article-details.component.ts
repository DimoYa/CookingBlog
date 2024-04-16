import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { Observable, Subscription } from 'rxjs';
import ArticleModel from 'src/app/core/models/article-model';
import CommentModel from 'src/app/core/models/comment-model';
import { ArticleService } from 'src/app/core/services/article.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CommentService } from 'src/app/core/services/comment.service';

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
  isAdmin: boolean;
  canLike!: boolean;
  canDislike!: boolean;
  isExpanded = false;

  constructor(
    private articleService: ArticleService,
    private commentService: CommentService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  private readonly confirmMsg =
    'Are you sure that you want to delete the article?';

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe((data) => {
        this.id = data['articleId'];
        this.articleService.getArticleById$(this.id).subscribe((data) => {
          this.article = data;

          this.comments$ = this.commentService.getAllCommentsByArticle$(
            this.id
          );
          this.currentuserName = this.authenticationService.returnUserName();
          this.canLike = !data.votes.includes(this.currentuserName) && data.author !== this.currentuserName;
          this.canDislike = data.votes.includes(this.currentuserName);

        });

      })
    );
    this.isAdmin = this.authenticationService.isAdmin();


  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  canModify(article: ArticleModel): boolean {
    return article.author === this.currentuserName || this.isAdmin;
  }

  deleteArticle(id: string): void {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle(this.confirmMsg);
    confirmBox.setButtonLabels('YES', 'NO');

    if (this.canModify(this.article)) {
      this.subscription.add(
        confirmBox.openConfirmBox$().subscribe((resp) => {
          // if (resp.success) {
          this.subscription.add(
            this.articleService.deleteArticle$(id).subscribe(() => {
              this.commentService.deleteAllCommentsByArticle$(id).subscribe(() => {
                this.router.navigate(['/article/list']);
              });
            })
          );
        }
        /*}*/)
      );
    }
  }

  loadComments(): void {
    this.comments$ = this.commentService.getAllCommentsByArticle$(this.id);
    this.isExpanded = true;
  }

  upvoteArticle(articleId: string): void {
    const body = this.article;

    body.votes.push(this.currentuserName);
    body.modified = this.article.author;

    this.subscription.add(
      this.articleService.editArticle$(body, articleId, 'upvoted').subscribe(() => {
       // Perform reload
      this.reloadCurrentRoute();
      })
    );
  }

  downVoteArticle(articleId: string): void {
    const body = this.article;
    const index = body.votes.indexOf(this.currentuserName);
    body.votes.splice(index, 1);
    body.modified = this.article.author;

    this.subscription.add(
      this.articleService.editArticle$(body, articleId, 'downvoted').subscribe(() => {
        // Perform reload
      this.reloadCurrentRoute();
      })
    );
  }

  reloadCurrentRoute(): void {
    // Reload the current route
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/article/list/${this.article._id}`]);
    });
  }
}
