import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ConfirmBoxInitializer } from '@costlydeveloper/ngx-awesome-popup';
import { Subscription } from 'rxjs';
import CommentModel from 'src/app/core/models/comment-model';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CommentService } from 'src/app/core/services/comment.service';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.css'],
})
export class CommentItemComponent implements OnInit {
  @Input() comment: CommentModel;
  @Output() articleCommentEmitter = new EventEmitter<void>();

  currentuserName: string;
  currentuserId: string;
  isAdmin: boolean;
  canModify!: boolean;
  canLike!: boolean;
  canDislike!: boolean;
  editMode: boolean = false;
  defaultAvatarPath!: string;
  subscription: Subscription = new Subscription();

  private readonly confirmMsg =
    'Are you sure that you want to delete the comment?';

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private commentService: CommentService
  ) { }

  editCommentForm: FormGroup = this.formBuilder.group({
    content: new FormControl(null, [Validators.required]),
  });

  ngOnInit(): void {
    this.currentuserName = this.authenticationService.returnUserName();
    this.currentuserId = this.authenticationService.returnId();
    this.isAdmin = this.authenticationService.isAdmin();

    this.canModify =
      this.comment.author === this.currentuserName || this.isAdmin;

    this.canLike =
      !this.comment.likes.includes(this.currentuserId) &&
      this.comment.author !== this.currentuserName;

    this.canDislike =
      this.comment.likes.includes(this.currentuserId);

    this.defaultAvatarPath = '../../../../assets/profile.png';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteComment(id: string): void {
    const confirmBox = new ConfirmBoxInitializer();
    confirmBox.setTitle(this.confirmMsg);
    confirmBox.setButtonLabels('YES', 'NO');

    this.subscription.add(
      confirmBox.openConfirmBox$().subscribe((resp) => {
        if (resp.success) {
          this.subscription.add(
            this.commentService.deleteComment$(id).subscribe(() => {
              this.articleCommentEmitter.emit();
            })
          );
        }
      })
    );
  }

  editComment(commentId: string, articleId: string): void {
    const body: CommentModel = this.editCommentForm.value;
    body.author = this.currentuserName;
    body.authorPicture = this.authenticationService.returnUserPhoto();
    body.articleId = articleId;
    body.likes = this.comment.likes;

    this.subscription.add(
      this.commentService.editComment$(body, commentId, 'updated').subscribe(() => {
        this.articleCommentEmitter.emit();
        this.editMode = false;
      })
    );
  }

  likeComment(commentId: string): void {
    const body = this.comment;
    body.likes.push(this.currentuserId);

    this.subscription.add(
      this.commentService.editComment$(body, commentId, 'liked').subscribe(() => {
        this.articleCommentEmitter.emit();
      })
    );
  }

  dislikeComment(commentId: string): void {
    const body = this.comment;
    const index = body.likes.indexOf(this.currentuserId);
    body.likes.splice(index, 1);
    this.subscription.add(
      this.commentService.editComment$(body, commentId, 'disliked').subscribe(() => {
        this.articleCommentEmitter.emit();
      })
    );
  }

  get f() {
    return this.editCommentForm.controls;
  }

  get invalid() {
    return this.editCommentForm.invalid;
  }
}
