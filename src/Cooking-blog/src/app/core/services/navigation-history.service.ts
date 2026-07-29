import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationHistoryService {
  private history: string[] = [];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => {
        this.history.push(event.urlAfterRedirects);

        // keep it small
        if (this.history.length > 20) {
          this.history.shift();
        }
      });
  }

  /**
   * Returns the most recent URL that is NOT an article-details page.
   * Details pages look like: /article/list/<id>
   */
  getLastListUrl(): string | null {
    const detailsPattern = /^\/article\/list\/[^/]+$/;

    for (let i = this.history.length - 1; i >= 0; i--) {
      const url = this.history[i].split('?')[0]; // ignore query params
      if (!detailsPattern.test(url)) {
        return this.history[i];
      }
    }

    return null;
  }
}