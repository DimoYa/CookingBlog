import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import ArticleModel from '../../../core/models/article-model';

@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.css'],
})
export class ArticleItemComponent implements OnInit {
  detailsBtnName!: string;
  isAdmin!: boolean;

  @Input('article') article!: ArticleModel;
  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.authenticationService.isAdmin();

    this.detailsBtnName =
      this.route.snapshot.url[0].path !== 'list' || this.isAdmin
        ? 'Details'
        : 'Continue reading';
  }
}
