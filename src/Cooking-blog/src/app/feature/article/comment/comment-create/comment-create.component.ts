import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import CommentModel from 'src/app/core/models/comment-model';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CommentService } from 'src/app/core/services/comment.service';

@Component({
  selector: 'app-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.css'],
})
export class CommentCreateComponent implements OnDestroy {
  subscription: Subscription = new Subscription();

  @Input() articleId: string;
  @Output() articleCommentEmitter = new EventEmitter<void>();

  commentForm: FormGroup = this.formBuilder.group({
    content: new FormControl(null, [Validators.required]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private commentService: CommentService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addComment(): void {
    const body: CommentModel = this.commentForm.value;
    body.articleId = this.articleId;
    body.author = this.authenticationService.returnUserName();
    body.authorPicture = this.authenticationService.returnUserPhoto();
    body.likes = [];

    this.subscription.add(
      this.commentService.addComment$(this.commentForm.value).subscribe(() => {
        this.commentForm.reset();
        this.articleCommentEmitter.emit();
      })
    );
  }

  get f() {
    return this.commentForm.controls;
  }

  get invalid() {
    return this.commentForm.invalid;
  }
}
