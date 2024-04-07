import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import ArticleModel from 'src/app/core/models/article-model';
import { ArticleService } from 'src/app/core/services/article.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css'],
})
export class ArticleCreateComponent implements OnDestroy {
  subscription: Subscription = new Subscription();

  articleCreateFormGroup: FormGroup = this.formBuilder.group({
    headline: new FormControl(null, [
      // Validators.required,
      Validators.maxLength(50),
    ]),
    content: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
    ]),
    image: new FormControl(null, [Validators.nullValidator]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private articleService: ArticleService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createArticle(): void {
    const body: ArticleModel = this.articleCreateFormGroup.value;
    body.author = this.authenticationService.returnUserName();

    this.subscription.add(
      this.articleService.createArticle$(body).subscribe(() => {
        this.router.navigate(['/article/list']);
      })
    );
  }
  get f() {
    return this.articleCreateFormGroup.controls;
  }

  get invalid() {
    return this.articleCreateFormGroup.invalid;
  }
}
