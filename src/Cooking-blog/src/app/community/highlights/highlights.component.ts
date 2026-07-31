import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import ArticleModel from 'src/app/core/models/article-model';
import CommentModel from 'src/app/core/models/comment-model';
import { ArticleService } from 'src/app/core/services/article.service';
import { CommentService } from 'src/app/core/services/comment.service';

export interface TopComment {
  content: string;
  author: string;
  authorPicture: string;
  likeCount: number;
}

export interface HighlightedArticle {
  article: ArticleModel;
  commentCount: number;
  topComment: TopComment;
}

export interface TopContributor {
  username: string;
  avatar: string;
  commentCount: number;
}

@Component({
  selector: 'app-community-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.css'],
})
export class CommunityHighlightsComponent implements OnInit {
  highlightedArticles: HighlightedArticle[] = [];
  topContributors: TopContributor[] = [];
  isLoading = true;
  defaultAvatar = '/assets/profile.png';

  constructor(
    private articleService: ArticleService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    forkJoin({
      articles: this.articleService.getArticles$(),
      comments: this.commentService.getAllComments$(),
    }).subscribe(({ articles, comments }) => {
      this.highlightedArticles = this.buildHighlightedArticles(articles, comments);
      this.topContributors = this.buildTopContributors(comments);
      this.isLoading = false;
    });
  }

  private buildHighlightedArticles(
    articles: ArticleModel[],
    comments: CommentModel[]
  ): HighlightedArticle[] {
    const byArticle = new Map<string, CommentModel[]>();
    for (const c of comments) {
      const bucket = byArticle.get(c.articleId) ?? [];
      bucket.push(c);
      byArticle.set(c.articleId, bucket);
    }

    return articles
      .filter((a) => (byArticle.get(a._id!) ?? []).length >= 3)
      .map((a) => {
        const articleComments = byArticle.get(a._id!)!;
        return {
          article: a,
          commentCount: articleComments.length,
          topComment: this.findTopComment(articleComments),
        };
      })
      .sort((a, b) => b.commentCount - a.commentCount);
  }

  private findTopComment(comments: CommentModel[]): TopComment {
    const best = comments.reduce((prev, cur) => {
      const prevLikes = prev.likes?.length ?? 0;
      const curLikes = cur.likes?.length ?? 0;
      if (curLikes > prevLikes) return cur;
      if (curLikes === prevLikes) {
        const prevDate = prev._kmd?.ect ?? '';
        const curDate = cur._kmd?.ect ?? '';
        return curDate > prevDate ? cur : prev;
      }
      return prev;
    });
    return {
      content: best.content,
      author: best.author,
      authorPicture: best.authorPicture || this.defaultAvatar,
      likeCount: best.likes?.length ?? 0,
    };
  }

  private buildTopContributors(comments: CommentModel[]): TopContributor[] {
    const byAuthor = new Map<string, { count: number; avatar: string }>();
    for (const c of comments) {
      const entry = byAuthor.get(c.author) ?? { count: 0, avatar: c.authorPicture || '' };
      entry.count += 1;
      if (!entry.avatar && c.authorPicture) entry.avatar = c.authorPicture;
      byAuthor.set(c.author, entry);
    }

    const result: TopContributor[] = [];
    byAuthor.forEach((val, username) => {
      if (val.count >= 3) {
        result.push({ username, avatar: val.avatar || this.defaultAvatar, commentCount: val.count });
      }
    });
    return result.sort((a, b) => b.commentCount - a.commentCount);
  }
}
