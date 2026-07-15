import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import ArticleModel from 'src/app/core/models/article-model';
import { ArticleService } from 'src/app/core/services/article.service';

@Component({
  selector: 'app-admin-article-management',
  templateUrl: './admin-article-management.component.html',
  styleUrls: ['./admin-article-management.component.css'],
})
export class AdminArticleManagementComponent implements OnInit, OnDestroy {
  articles!: ArticleModel[];
  pageSlice!: ArticleModel[];
  subscription: Subscription = new Subscription();
  startIndex = 0;
  endIndex = 5;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadArticles(): void {
    this.subscription.add(
      this.articleService.getArticles$().subscribe((data) => {
        this.articles = data;
        this.pageSlice = this.articles.slice(0, 5);
      })
    );
  }

  deleteArticle(id: string): void {
    this.subscription.add(
      this.articleService.deleteArticle$(id).subscribe(() => {
        this.loadArticles();
      })
    );
  }

  public OnPageChange(event: PageEvent): void {
    this.startIndex = event.pageIndex * event.pageSize;
    this.endIndex = this.startIndex + event.pageSize;
    if (this.endIndex > this.articles.length) {
      this.endIndex = this.articles.length;
    }
    this.pageSlice = this.articles.slice(this.startIndex, this.endIndex);
  }
}
