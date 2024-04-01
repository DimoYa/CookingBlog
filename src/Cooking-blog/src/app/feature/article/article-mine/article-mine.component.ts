import { Component, OnDestroy, OnInit } from '@angular/core';
import ArticleModel from 'src/app/core/models/article-model';
import { ArticleService } from 'src/app/core/services/article.service';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-mine',
  templateUrl: './article-mine.component.html',
  styleUrls: ['./article-mine.component.css'],
})
export class ArticleMineComponent implements OnInit, OnDestroy {
  myArticles!: ArticleModel[];
  pageSlice!: ArticleModel[];
  subscription: Subscription = new Subscription();

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.articleService.getUserArticles$().subscribe((data) => {
        this.myArticles = data;
        this.pageSlice = this.myArticles.slice(0, 3);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public OnPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.myArticles.length) {
      endIndex = this.myArticles.length;
    }
    this.pageSlice = this.myArticles.slice(startIndex, endIndex);
  }
}
