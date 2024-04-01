import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import ArticleModel from 'src/app/core/models/article-model';
import { ArticleService } from 'src/app/core/services/article.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.css'],
})
export class ArticleEditComponent implements OnInit {
  article: ArticleModel;
  id: string;
  currentuserName: string;
  subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.route.params.subscribe((data) => {
        this.id = data['articleId'];
        this.articleService.getArticleById$(this.id).subscribe((data) => {
          this.article = data;
        });
      })
    );
    this.currentuserName = this.authenticationService.returnUserName();
  }

  editArticleForm: FormGroup = this.fb.group({
    headline: new FormControl(null, [
      Validators.required,
      Validators.maxLength(40),
    ]),
    content: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
    ]),
    image: new FormControl(null, [Validators.nullValidator]),
  });

  editArticle(): void {
    const body: ArticleModel = this.editArticleForm.value;
    body.author = this.article.author;
    body.modified = this.currentuserName;

    this.articleService.editArticle$(body, this.article._id).subscribe(() => {
      this.router.navigate([`/article/list/${this.id}`]);
    });
  }
  get f() {
    return this.editArticleForm.controls;
  }

  cancel(): void {
    this.router.navigate([`/article/list/${this.id}`]);
  }

  get invalid() {
    return this.editArticleForm.invalid;
  }
}
