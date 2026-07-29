import { Component } from '@angular/core';
import { NavigationHistoryService } from './core/services/navigation-history.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cokking-blog';
  constructor(private navigationHistory: NavigationHistoryService) {}
}
