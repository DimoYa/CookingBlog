import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  articleContentValidator,
  articleHeadlineValidator,
  articleImageValidator,
} from 'src/app/authentication/utils';

import ArticleModel from 'src/app/core/models/article-model';
import { ArticleService } from 'src/app/core/services/article.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css'],
})
export class ArticleEditComponent implements OnInit, OnDestroy {
  article: ArticleModel;
  id: string;
  currentuserName: string;

  subscription: Subscription = new Subscription();

  editArticleForm: FormGroup = this.fb.group({
    headline: new FormControl(null, [
      Validators.required,
      Validators.maxLength(50),
      articleHeadlineValidator,
    ]),
    content: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      articleContentValidator,
    ]),
    image: new FormControl('', [
      articleImageValidator,
    ]),
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.currentuserName =
      this.authenticationService.returnUserName();

    this.subscription.add(
      this.route.params.subscribe((data) => {
        this.id = data['articleId'];

        this.subscription.add(
          this.articleService
            .getArticleById$(this.id)
            .subscribe((data) => {
              this.article = data;

              this.editArticleForm.patchValue({
                headline: this.article.headline,
                content: this.article.content,
                image: this.article.image || '',
              });
            })
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editArticle(): void {
    if (this.editArticleForm.invalid) {
      this.editArticleForm.markAllAsTouched();
      return;
    }

    const body: ArticleModel = this.editArticleForm.value;

    body.author = this.article.author;
    body.modified = this.currentuserName;

    this.subscription.add(
      this.articleService
        .editArticle$(body, this.article._id)
        .subscribe(() => {
          this.router.navigate([
            `/article/list/${this.id}`,
          ]);
        })
    );
  }

  cancel(): void {
    this.router.navigate([
      `/article/list/${this.id}`,
    ]);
  }

  get f() {
    return this.editArticleForm.controls;
  }

  get invalid(): boolean {
    return this.editArticleForm.invalid;
  }
}